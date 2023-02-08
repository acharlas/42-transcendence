import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { ChannelService } from '../channel/channel.service';
import { JwtModule } from '@nestjs/jwt';
import { FriendService } from 'src/friend/friend.service';
import { BlockService } from 'src/block/block.service';
import { UserService } from 'src/user/user.service';
import { GameGateway } from 'src/game/game.gateway';
import { HistoryService } from 'src/history/history.service';
import { GameModule } from 'src/game/game.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [MessageController],
  imports: [JwtModule, GameModule, SocketModule],
  providers: [
    MessageService,
    MessageGateway,
    ChannelService,
    FriendService,
    BlockService,
    UserService,
    GameGateway,
    HistoryService,
  ],
  exports: [MessageGateway]
})
export class MessageModule {}
