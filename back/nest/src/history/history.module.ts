import { Module } from '@nestjs/common';
import { HistoryService } from './service/history.service';
import { HistoryController } from './controller/history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './models/history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryEntity])
  ],
  providers: [HistoryService],
  controllers: [HistoryController]
})
export class HistoryModule {}
