import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthSigninDto, AuthSignupDto, getApiToken } from './dto';
import { JwtGuard, JwtRefreshGuard } from './guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto): Promise<{ access_token: string }> {
    return new Promise<{ access_token: string }>((resolve, reject) => {
      this.authService
        .signup(dto)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          console.log('error:', { err });
          return reject(err);
        });
    });
  }

  @Post('signin')
  async signin(@Body() dto: AuthSigninDto): Promise<{ access_token: string }> {
    return new Promise<{ access_token: string }>((resolve, reject) => {
      this.authService
        .signin(dto)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Post('signinApi')
  async signinApi(@Body() dto: getApiToken): Promise<{ access_token: string }> {
    return new Promise<{ access_token: string }>((resolve, reject) => {
      this.authService
        .getApiToken(dto)
        .then((ret) => {
          this.authService
            .getFortyTwoMe(ret)
            .then((ret) => {
              this.authService
                .signWithApi(ret)
                .then((ret) => {
                  console.log({ ret });
                  return resolve(ret);
                })
                .catch((err) => {
                  return reject(err);
                });
            })
            .catch((err) => {
              return reject(err);
            });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    console.log(req);
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    console.log(userId, refreshToken);
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('logout')
  logout(@GetUser('id') userId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.authService
        .logout(userId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
