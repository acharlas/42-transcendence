import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from '../auth/guard';
import { HistoryService } from './history.service';
import { HistoryMatch } from './types_history';

@ApiTags('History')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('me')
  getUserHistory(@GetUser('id') userId: string): Promise<HistoryMatch[]> {
    return new Promise<HistoryMatch[]>((resolve, reject) => {
      //console.log('get history: ', userId);
      this.historyService
        .getUserHistory(userId)
        .then((history) => {
          return resolve(history);
        })
        .catch((err) => {
          //console.log('err: ', err);
          return reject(err);
        });
    });
  }
}
