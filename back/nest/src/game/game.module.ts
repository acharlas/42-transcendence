import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { HistoryService } from 'src/history/history.service';
import { SocketModule } from 'src/socket/socket.module';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';

@Module({
  imports: [JwtModule, ScheduleModule.forRoot(), SocketModule],
  providers: [GameService, HistoryService, SchedulerRegistry, UserService, GameService],
  exports: [GameService]
})
export class GameModule {}
