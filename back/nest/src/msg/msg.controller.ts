import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateMsgDto } from './dto';
import { MsgService } from './msg.service';

@UseGuards(JwtGuard)
@Controller('channel')
export class MsgController {
  constructor(private msgService: MsgService) {}

  @Get()
  @ApiBearerAuth()
  getMsg(@GetUser('id') userId: string) {
    return this.msgService.getMsg(userId);
  }

  @Post(':chan')
  @ApiBearerAuth()
  createMsg(
    @Param('chan') channel: string,
    @GetUser('id') userId: string,
    @Body() dto: CreateMsgDto,
  ) {
    console.log({ channel });
    return this.msgService.createMsg(userId, dto);
  }

  @Get(':id')
  @ApiBearerAuth()
  getMsgById(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) msgId: string,
  ) {
    return this.msgService.getMsgById(
      userId,
      msgId,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  deleteMsgById(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) msgId: string,
  ) {
    return this.msgService.deleteMsgById(
      userId,
      msgId,
    );
  }
}
