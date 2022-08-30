import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthSigninDto,
  AuthSigninWithApiDto,
  AuthSignupDto,
  getApiToken,
} from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthSignupDto): Promise<{ access_token: string }> {
    //generate password hash
    const hash = await argon.hash(dto.password);

    //save the new user in db
    let nickname = dto.username;
    if (!dto.nickname && dto.nickname !== '' && dto.nickname !== undefined) {
      nickname = dto.nickname;
    }
    return new Promise<{ access_token: string }>((resolve, reject) => {
      this.prisma.user
        .create({
          data: {
            email: dto.email,
            username: dto.username,
            hash,
            nickname,
            userType: 'normal',
            fortyTwoId: -1,
          },
        })
        .then((ret) => {
          this.signToken(ret.id)
            .then((ret) => {
              return resolve(ret);
            })
            .catch((err) => {
              return reject(err);
            });
        })
        .catch((err) => {
          /*if (err.meta.target[0] === 'email') {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'email already take',
                  code: '101',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          } else {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'username already take',
                  code: '102',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }*/
        });
    });
  }

  async signin(dto: AuthSigninDto): Promise<{ access_token: string }> {
    // find  the user by email
    return new Promise<{ access_token: string }>((resolve, reject) => {
      this.prisma.user
        .findUnique({
          where: {
            email: dto.email,
          },
        })
        .then((ret) => {
          if (!ret) {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'wrong email',
                  code: 103,
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }
          return resolve(
            new Promise<{ access_token: string }>((resolve, reject) => {
              argon.verify(ret.hash, dto.password).then((res) => {
                if (!res) {
                  return reject(
                    new HttpException(
                      {
                        status: HttpStatus.FORBIDDEN,
                        error: 'wrong password',
                        code: 104,
                      },
                      HttpStatus.FORBIDDEN,
                    ),
                  );
                }
                return resolve(this.signToken(ret.id));
              });
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async signToken(userId: String): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return {
      access_token: token,
    };
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
      client_id: this.config.get<string>('UID'),
      client_secret: this.config.get<string>('API_SECRET'),
      code: dto.code,
      redirect_uri: 'http://localhost:3001/42-redirect',
      state: dto.state,
    };
    console.log({ payload });
    return new Promise<string>((resolve, reject) => {
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
          console.log('error:', err);
          return reject(err);
        });
    });
  }

  async signWithApi(
    user: AuthSigninWithApiDto,
  ): Promise<{ access_token: string }> {
    const found = await this.prisma.user.findFirst({
      where: {
        userType: 'fortyTwo',
        fortyTwoId: user.id,
      },
    });
    return new Promise<{ access_token: string }>((resolve, reject) => {
      console.log('found', { found });
      if (found !== null) {
        this.signToken(found.id)
          .then((ret) => {
            return resolve(ret);
          })
          .catch((err) => {
            return reject(err);
          });
      } else {
        this.prisma.user
          .create({
            data: {
              email: '',
              username: user.login,
              hash: '',
              nickname: user.login,
              userType: 'fortyTwo',
              fortyTwoId: user.id,
            },
          })
          .then((ret) => {
            console.log('token');
            return resolve(this.signToken(ret.id));
          })
          .catch((err) => {
            return reject(err);
          });
      }
    });
  }
}
