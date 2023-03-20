import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { MfaService } from './mfa.service';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaValidateDto } from './dto/mfa-validate.dto';

@Controller('mfa')
@ApiBearerAuth()
@ApiTags('Mfa')
@UseGuards(JwtGuard)
export class MfaController {
  constructor(
    private mfaService: MfaService,
  ) // private authService: AuthService,
  {}

  @Post('signin/init')
  @HttpCode(HttpStatus.OK)
  async initSignIn(@GetUser('id') userId: string) {
    //console.log('mfa/signin/init');
    return this.mfaService.initSignIn(userId);
  }

  @Post('signin/validate')
  @HttpCode(HttpStatus.OK)
  async validateSignIn(
    @GetUser('id') userId: string,
    @Body() dto: MfaValidateDto,
  ) {
    //console.log('mfa/signin/validate', userId, { dto });
    return this.mfaService.validateSignIn(userId, dto);
  }

  @Post('setup/init')
  @HttpCode(HttpStatus.CREATED)
  async initSetup(@GetUser('id') userId: string, @Body() dto: MfaSetupDto) {
    //console.log('mfa/setup/init', { dto });
    return this.mfaService.initSetup(userId, dto);
  }

  @Post('setup/validate')
  @HttpCode(HttpStatus.CREATED)
  async finishSetup(
    @GetUser('id') userId: string,
    @Body() dto: MfaValidateDto,
  ) {
    //console.log('mfa/setup/validate', { dto });
    return this.mfaService.finishSetup(userId, dto);
  }

  @Delete('disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disable(@GetUser('id') userId: string) {
    //console.log('mfa/disable');
    return this.mfaService.disable(userId);
  }
}
