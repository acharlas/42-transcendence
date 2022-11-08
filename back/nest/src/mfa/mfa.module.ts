import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MfaController } from './mfa.controller';
import { MfaService } from './mfa.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [MfaController],
  providers: [MfaService]
})
export class MfaModule { }
