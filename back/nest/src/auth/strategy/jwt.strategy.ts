import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
    private moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: { sub: string; fullyAuth: boolean },
  ) {
    if (
      !payload.fullyAuth &&
      request.url !== '/mfa/signin/init' &&
      request.url !== '/mfa/signin/validate'
    ) {
      console.log('not full auth');
      throw new UnauthorizedException('2FA required');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;
    return user;
  }
}
