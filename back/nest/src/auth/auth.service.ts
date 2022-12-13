import axios from 'axios';
import * as argon from 'argon2';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import {
  AuthSigninDto,
  AuthSigninWithApiDto,
  AuthSignupDto,
  getApiToken,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  hashData(data: string) {
    return argon.hash(data);
  }

  async updateRefreshToken(userId: string, newRefreshToken: string) {
    const hashedRefreshToken = await this.hashData(newRefreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async signTokens(
    userId: string,
    mfaNeeded: boolean,
  ): Promise<{ access_token: string; refresh_token: string }> {
    //if mfa is disabled, the user is fully authenticated
    //if mfa is enabled, the user still needs to pass mfa
    const payload = {
      sub: userId,
      fullyAuth: !mfaNeeded,
    };
    //TODO: 2 secrets
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '2d',
        secret: this.config.get('JWT_SECRET'),
      }),
    ]);
    await this.updateRefreshToken(userId, refreshToken);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async getFortyTwoMe(Token: string): Promise<AuthSigninWithApiDto> {
    return new Promise<AuthSigninWithApiDto>((resolve, reject) => {
      axios({
        method: 'get',
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        url: 'https://api.intra.42.fr/v2/me',
      })
        .then((ret) => {
          return resolve(ret.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async getApiToken(dto: getApiToken): Promise<string> {
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.config.get<string>('42API_UID'),
      client_secret: this.config.get<string>('42API_SECRET'),
      code: dto.code,
      redirect_uri: this.config.get<string>('42API_REDIRECT'),
      state: dto.state,
    };
    return new Promise<string>((resolve, reject) => {
      console.log({ payload });
      axios({
        method: 'post',
        url: 'https://api.intra.42.fr/oauth/token',
        data: payload,
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((ret) => {
          return resolve(ret.data.access_token);
        })
        .catch((err) => {
          console.log('axios error:', err);
          return reject(
            new ForbiddenException('Failed authenticating with oauth'),
          );
        });
    });
  }

  // Endpoints

  async signup(
    dto: AuthSignupDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const hash = await this.hashData(dto.password);

    let nickname = dto.username;
    if (!dto.nickname && dto.nickname !== '' && dto.nickname !== undefined) {
      nickname = dto.nickname;
    }

    return new Promise<{ access_token: string; refresh_token: string }>(
      (resolve, reject) => {
        this.prisma.user
          .create({
            data: {
              username: dto.username,
              hash,
              nickname,
              userType: 'normal',
              fortyTwoId: -1,
            },
          })
          .then((ret) => {
            this.signTokens(ret.id, false)
              .then((ret) => {
                return resolve(ret);
              })
              .catch((err) => {
                console.log('signup: signToken error', err);
                return reject(new UnauthorizedException('signup failed'));
              });
          })
          .catch((err) => {
            console.log('signup: prisma.user.create error', err);
            return reject(new UnauthorizedException('username taken'));
          });
      },
    );
  }

  async signin(
    dto: AuthSigninDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return new Promise<{ access_token: string; refresh_token: string }>(
      (resolve, reject) => {
        this.prisma.user
          .findUnique({
            where: {
              username: dto.username,
            },
          })
          .then((ret) => {
            if (!ret) {
              return reject(new ForbiddenException('wrong username'));
            }
            return resolve(
              new Promise<{ access_token: string; refresh_token: string }>(
                (resolve, reject) => {
                  argon.verify(ret.hash, dto.password).then((res) => {
                    if (!res) {
                      return reject(new ForbiddenException('wrong password'));
                    }
                    return resolve(this.signTokens(ret.id, ret.mfaEnabled));
                  });
                },
              ),
            );
          })
          .catch((err) => {
            console.log(err);
            return reject(new ForbiddenException('wrong password'));
          });
      },
    );
  }

  async signWithApi(
    user: AuthSigninWithApiDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const found = await this.prisma.user.findFirst({
      where: {
        userType: 'fortyTwo',
        fortyTwoId: user.id,
      },
    });
    return new Promise<{ access_token: string; refresh_token: string }>(
      (resolve, reject) => {
        if (found !== null) {
          this.signTokens(found.id, found.mfaEnabled)
            .then((ret) => {
              return resolve(ret);
            })
            .catch((err) => {
              console.log(err);
              return reject(
                new ForbiddenException('Failed authenticating with oauth'),
              );
            });
        } else {
          this.prisma.user
            .create({
              data: {
                username: user.login,
                hash: '',
                nickname: user.login,
                userType: 'fortyTwo',
                fortyTwoId: user.id,
              },
            })
            .then((ret) => {
              return resolve(this.signTokens(ret.id, ret.mfaEnabled));
            })
            .catch((err) => {
              console.log(err);
              return reject(
                new ForbiddenException('Failed to signup with oauth.'),
              );
            });
        }
      },
    );
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('no user');
    if (!user.refreshToken) throw new ForbiddenException('no refresher stored');
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException('refresh token does not match');
    const tokens = await this.signTokens(user.id, false); //refresh authguard already denies if 2fa missing
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}
