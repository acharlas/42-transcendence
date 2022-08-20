import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSigninApiDto, AuthSigninDto, AuthSignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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
        },
      });

      return this.signToken(user.id, user.email);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          console.log(e.meta);
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
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: String,
    email: String,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
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

  async signinApi(dto: AuthSigninApiDto) {
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.config.get<string>('UID'),
      client_secret: this.config.get<string>('API_SECRET'),
      code: dto.code,
      redirect_uri: this.config.get<string>('APP_REDIRECT_URI'),
      state: dto.state,
    };
    let ret;

    console.log({ payload });
    try {
      const res = await axios({
        method: 'post',
        url: 'https://api.intra.42.fr/oauth/token',
        data: JSON.stringify(payload),
        headers: {
          'content-type': 'application/json',
        },
      });
      return res;
    } catch (e) {
      console.log({ e });
    }
  }
}
