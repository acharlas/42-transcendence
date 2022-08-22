import { Controller, Module, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryGateway } from './history.gateway';
import { HistoryController } from './history.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@Module({
  providers: [HistoryGateway, HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
