import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSigninDto, AuthSignupDto, getApiToken } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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
}
