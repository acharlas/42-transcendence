import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { ChannelService } from '../channel/channel.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [MessageController],
  imports: [JwtModule],
  providers: [MessageService, MessageGateway, ChannelService],
})
export class MessageModule {}
