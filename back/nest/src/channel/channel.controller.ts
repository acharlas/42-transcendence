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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { ChannelService } from './channel.service';
import { CreateChannelDto, EditChannelDto, JoinChannelDto } from './dto';
import { Channel, ChannelType, ChannelUser, Message } from '@prisma/client';
import { GetChannelById, MessageCont, Room } from './type_channel';

@Controller('channels')
@ApiTags('Channels')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  createChannel(
    @GetUser('id') userId: string,
    @Body() dto: CreateChannelDto,
  ): Promise<Room> {
    return new Promise<Room>((resolve, reject) => {
      this.channelService
        .createChannel(userId, dto)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @ApiQuery({
    name: 'type',
    enum: ChannelType,
    required: false,
  })
  @Get()
  getChannels(
    @GetUser('id') userId: string,
  ): Promise<{ id: string; name: string; type: ChannelType }[]> {
    return new Promise<{ id: string; name: string; type: ChannelType }[]>(
      (resolve, reject) => {
        this.channelService
          .getChannels(userId)
          .then((ret) => {
            return resolve(ret);
          })
          .catch((err) => {
            return reject(err);
          });
      },
    );
  }

  @Get(':id')
  getChannelById(@Param('id') channelId: string): Promise<GetChannelById> {
    return new Promise<GetChannelById>((resolve, reject) => {
      this.channelService
        .getChannelById(channelId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Patch(':id')
  editChannel(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
    @Body() dto: EditChannelDto,
  ): Promise<Channel> {
    return new Promise<Channel>((resolve, reject) => {
      this.channelService
        .editChannel(userId, channelId, dto)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteChannelById(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
  ): Promise<Channel> {
    return new Promise<Channel>((resolve, reject) => {
      this.channelService
        .deleteChannelById(userId, channelId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/join')
  joinChannel(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
    @Body() dto: JoinChannelDto,
  ): Promise<Room> {
    return new Promise<Room>((resolve, reject) => {
      this.channelService
        .joinChannelById(userId, channelId, dto)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/leave')
  leaveChannel(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
  ): Promise<ChannelUser> {
    return new Promise<ChannelUser>((resolve, reject) => {
      this.channelService
        .leaveChannel(userId, channelId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/message')
  getChannelMessage(
    @GetUser('id') userId: string,
    @Param('id') channelId: string,
  ): Promise<MessageCont[]> {
    return new Promise<MessageCont[]>((resolve, reject) => {
      this.channelService
        .getChannelMessage(channelId, userId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
