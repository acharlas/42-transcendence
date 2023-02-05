import { Controller, UseGuards, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GameService } from './game.service';

@Controller('status')
// @ApiBearerAuth()
// @UseGuards(JwtGuard)
export class GameController {
  constructor (private gameService: GameService) {}
  @ApiTags('Status')
  @HttpCode(HttpStatus.OK)
  @Get('ingame/:id')
  getIngame(
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.gameService.isPlaying(id);
  }
}
