import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MfaController } from './mfa.controller';
import { MfaService } from './mfa.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [JwtModule.register({}), AuthModule],
  controllers: [MfaController],
  providers: [MfaService],
})
export class MfaModule {}
