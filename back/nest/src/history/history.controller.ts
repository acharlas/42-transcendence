import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { HistoryService } from './history.service';

@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
  ) {}

  @Get(':id')
  getHistoryId(@Param('id') userId: string) {
    return this.historyService.getHistoryId(
      userId,
    );
  }
}
