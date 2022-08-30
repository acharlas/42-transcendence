import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateMessageDto } from './dto';
import { MessageService } from './message.service';

@Controller('channels')
@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class MessageController {
  // constructor(private readonly messageService: MessageService) {}
  // @HttpCode(HttpStatus.OK)
  // @Post(':channelId/messages')
  // postMessage(
  //   @GetUser('id') userId: string,
  //   @Param('channelId') channelId: string,
  //   @Body() dto: CreateMessageDto,
  // ) {
  //   return this.messageService.postMessage(userId, channelId, dto);
  // }
  // @Get(':channelId/messages')
  // getMessages(@Param('channelId') channelId: string) {
  //   return this.messageService.getMessagesfromChannel(channelId);
  // }
  // @Get(':channelId/:messageId')
  // getMessageById(
  //   @Param('channelId') channelId: string,
  //   @Param('messageId') messageId: string,
  // ) {
  //   return this.messageService.getMessageById(channelId, messageId);
  // }
}
