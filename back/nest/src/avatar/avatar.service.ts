import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { unlinkSync } from 'fs';

import { PrismaService } from '../prisma/prisma.service';
import { AvatarPathDto } from './dto/avatar.dto';

@Injectable()
export class AvatarService {
  constructor(private prisma: PrismaService) { }

  async saveAvatar(userId: string, dto: AvatarPathDto) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarPath: dto.path,
      },
    });
    return true;
  }

  async deleteAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (user.avatarPath) {
      //can use async for better perfs
      unlinkSync(user.avatarPath);
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarPath: "",
        },
      });
    }
  }

  async getAvatar(targetId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: targetId,
      }
    });
    console.log(user.avatarPath);
    //TODO
    if (user.avatarPath) {
      console.log("return avatar");
    }
    else {
      console.log("default avatar");
    }
    return (true);
  }

}
