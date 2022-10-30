import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ApiFileAvatar } from './api-avatar.decorator';
import { AvatarService } from './avatar.service';

@ApiTags('Avatar')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('avatar')
export class AvatarController {
  constructor(private avatarService: AvatarService) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiFileAvatar()
  postAvatar(
    @GetUser('id') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    console.log("postAvatar");
    console.log(avatar);
    this.avatarService.saveAvatar(userId, { path: avatar.path });
  }

  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAvatar(@GetUser('id') userId: string) {
    console.log("deleteAvatar");
    this.avatarService.deleteAvatar(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAvatar(@Param('id') targetId: string) {
    console.log("getAvatar");
    this.avatarService.getAvatar(targetId);
  }
}
