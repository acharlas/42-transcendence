import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';


@Module({
  controllers: [GameController],
  imports: [JwtModule],
  providers: [
    GameGateway,
    GameService
  ],
})
export class GameModule {}
