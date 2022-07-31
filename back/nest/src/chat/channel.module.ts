import { Module } from '@nestjs/common';
import { ChannelService } from './service/channel.service';
import { ChannelController } from './controller/channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './models/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity])
  ],
  providers: [ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}
