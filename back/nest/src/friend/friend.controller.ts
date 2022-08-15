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
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { FriendDto } from './dto';
import { FriendService } from './friend.service';

@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  addFriend(
    @GetUser('id') userId: string,
    @Body() dto: FriendDto,
  ): Promise<{ myfriend: User[] }> {
    return this.friendService.addFriend(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('remove')
  removeFriend(
    @GetUser('id') userId: string,
    @Body() dto: FriendDto,
  ): Promise<{ myfriend: User[] }> {
    return this.friendService.removeFriend(userId, dto);
  }

  @Get(':id')
  getFriend(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<{ myfriend: User[] }> {
    return this.friendService.getFriend(userId, id);
  }
}
