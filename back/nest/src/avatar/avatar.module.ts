import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  imports: [
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule { }
