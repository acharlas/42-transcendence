import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
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
      console.log("Can't validate: Missing 2FA");
      throw new UnauthorizedException('2FA required');
    }
    try {
      const refreshToken = request
      .get('Authorization')
      .replace('Bearer', '')
      .trim();
      return { ...payload, refreshToken };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('request error');
    }
  }
}
