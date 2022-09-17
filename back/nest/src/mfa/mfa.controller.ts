import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { GetUser } from '../auth/decorator';
import { MfaService } from './mfa.service';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaValidateDto } from './dto/mfa-validate.dto';

@Controller('Mfa')
@ApiTags('Mfa')
export class MfaController {
  constructor(private mfaService: MfaService) { }

  @Post('init-setup')
  async initSetup(
    @GetUser('id') userId: string,
    @Body() dto: MfaSetupDto) {
    //TODO
    return this.mfaService.initSetup(userId, dto);
  }

  @Post('finish-setup')
  async finishSetup(
    @GetUser('id') userId: string,
    @Body() dto: MfaValidateDto) {
    //TODO
    return this.mfaService.finishSetup(userId, dto);
  }

  @Get('disable')
  async disable(@GetUser('id') userId: string) {
    //TODO
    return this.mfaService.disable(userId);
  }
}
