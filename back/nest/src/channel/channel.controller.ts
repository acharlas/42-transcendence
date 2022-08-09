import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { ChannelService } from './channel.service';
import {
  CreateChannelDto,
  EditChannelDto,
} from './dto';
import { ChannelType } from '@prisma/client';

@Controller('channels')
@ApiTags('channels')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(
    private channelService: ChannelService,
  ) {}

  @Post()
  createChannel(
    @GetUser('id') userId: string,
    @Body() dto: CreateChannelDto,
  ) {
    return this.channelService.createChannel(
      userId,
      dto,
    );
  }

  @ApiQuery({
    name: 'type',
    enum: ChannelType,
    required: false,
  })
  @Get()
  getChannels(@Query('type') type: ChannelType) {
    return this.channelService.getChannels(type);
  }

  @Get(':id')
  getChannelById(@Param('id') channelId: string) {
    return this.channelService.getChannelById(
      channelId,
    );
  }

  @Patch(':id')
  editChannel(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
    @Body() dto: EditChannelDto,
  ) {
    return this.channelService.editChannel(
      userId,
      channelId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteChannelById(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
  ) {
    return this.channelService.deleteChannelById(
      userId,
      channelId,
    );
  }
}
