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
  StreamableFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ApiFileAvatar } from './api-avatar.decorator';
import { AvatarService } from './avatar.service';

@ApiTags('Avatar')
@Controller('avatar')
export class AvatarController {
  constructor(private avatarService: AvatarService) { }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiFileAvatar()
  postAvatar(
    @GetUser('id') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    console.log('postAvatar');
    if (!avatar) {
      throw new BadRequestException('no avatar');
    }
    console.log(avatar);
    this.avatarService.saveAvatar(userId, { path: avatar.path });
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAvatar(@GetUser('id') userId: string) {
    console.log('deleteAvatar');
    this.avatarService.deleteAvatar(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAvatar(
    @Param('id') targetId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    console.log('getAvatar');
    return new Promise<StreamableFile>((resolve, reject) => {
      return this.avatarService
        .getAvatar(targetId)
        .then((ret) => {
          res.set('Content-Type', 'image');
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
