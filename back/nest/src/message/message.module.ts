import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { ChannelService } from '../channel/channel.service';
import { JwtModule } from '@nestjs/jwt';
import { FriendService } from 'src/friend/friend.service';
import { BlockService } from 'src/block/block.service';

@Module({
  controllers: [MessageController],
  imports: [JwtModule],
  providers: [
    MessageService,
    MessageGateway,
    ChannelService,
    FriendService,
    BlockService,
  ],
})
export class MessageModule {}
