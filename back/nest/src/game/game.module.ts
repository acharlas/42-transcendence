import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  controllers: [GameController],
  imports: [JwtModule, ScheduleModule.forRoot()],
  providers: [GameGateway, GameService],
})
export class GameModule {}
