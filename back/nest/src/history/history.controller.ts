import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { HistoryService } from './history.service';

@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
  ) {}
}
