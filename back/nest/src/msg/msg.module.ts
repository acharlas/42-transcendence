import { Module } from '@nestjs/common';
import { MsgService } from './msg.service';
import { MsgController } from './msg.controller';

@Module({
  providers: [MsgService],
  controllers: [MsgController]
})
export class MsgModule {}
