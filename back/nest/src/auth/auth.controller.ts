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
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthSigninDto): Promise<{ access_token: string }> {
    return this.authService.signin(dto);
  }

  @Post('signinApi')
  async signinApi(@Body() dto: getApiToken): Promise<{ access_token: string }> {
    console.log('siginin', { dto });
    try {
      const token = await this.authService.getApiToken(dto);
      console.log('token', { token });
      const user = await this.authService.getFortyTwoMe(token);
      console.log('user', { user });
      return new Promise<{ access_token: string }>((resolve, reject) => {
        this.authService
          .signWithApi(user)
          .then((ret) => {
            console.log({ ret });
            return resolve(ret);
          })
          .catch((err) => {
            return reject(err);
          });
      });
    } catch (e) {
      console.log('erreur', { e });
      return e;
    }
  }
}
