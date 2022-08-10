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
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { FriendDto } from './dto';
import { FriendService } from './friend.service';

@Controller('friend')
@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('friend')
export class FriendController {
  constructor(
    private friendService: FriendService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/friend/add')
  addFriend(
    @GetUser('id') userId: string,
    @Body() dto: FriendDto,
  ) {
    return this.friendService.addFriend(
      userId,
      dto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('/friend/remove')
  removeFriend(
    @GetUser('id') userId: string,
    @Body() dto: FriendDto,
  ) {
    return this.friendService.removeFriend(
      userId,
      dto,
    );
  }

  @Get(':id/friend')
  getFriend(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.friendService.getFriend(
      userId,
      id,
    );
  }
}
