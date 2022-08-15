import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
@ApiTags('Leaderboard')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }
}
