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
import { AuthSigninApiDto, AuthSigninDto, AuthSignupDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthSigninDto) {
    return this.authService.signin(dto);
  }

  @Post('signinApi')
  async signinApi(@Body() dto: AuthSigninApiDto) {
    console.log('siginin', { dto });
    try {
      const token = await this.authService.signinApi(dto);
      console.log('token', { token });
      const user = await this.authService.getFortyTwoMe(token);
      console.log('user', { user });
    } catch (e) {
      console.log({ e });
    }
  }
}
