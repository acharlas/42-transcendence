import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthSigninDto,
  AuthSigninWithApiDto,
  AuthSignupDto,
  getApiToken,
} from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { url } from 'inspector';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthSignupDto) {
    //generate password hash
    const hash = await argon.hash(dto.password);

    try {
      //save the new user in db
      let nickname = dto.username;
      if (!dto.nickname && dto.nickname !== '' && dto.nickname !== undefined) {
        nickname = dto.nickname;
      }
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash,
          nickname,
          userType: 'normal',
          fortyTwoId: -1,
        },
      });

      return this.signToken(user.id);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw e;
    }
  }

  async signin(dto: AuthSigninDto) {
    // find  the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    //compare password
    const pwMathes = await argon.verify(user.hash, dto.password);
    //if password incorrect throw error
    if (!pwMathes) throw new ForbiddenException('Credentials incorrect');

    //send back the user
    return this.signToken(user.id);
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
    /*let uname = user.login;
        let sameUname = await this.prisma.user.findFirst({
          where: { username: uname },
        });
        console.log('find', { sameUname });
        while (sameUname) {
          uname += '_';
          sameUname = await this.prisma.user.findFirst({
            where: { username: uname },
          });*/
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
