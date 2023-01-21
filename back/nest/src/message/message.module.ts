import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { ChannelService } from '../channel/channel.service';
import { JwtModule } from '@nestjs/jwt';
import { FriendService } from 'src/friend/friend.service';
import { BlockService } from 'src/block/block.service';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { GameGateway } from 'src/game/game.gateway';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [MessageController],
  imports: [JwtModule],
  providers: [
    MessageService,
    MessageGateway,
    ChannelService,
    FriendService,
    BlockService,
    UserService,
    GameService,
    GameGateway,
    HistoryService,
  ],
})
export class MessageModule {}
