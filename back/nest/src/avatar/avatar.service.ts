import {
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

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
    if (user && user.avatarPath) {
      const file = readFileSync(join(process.cwd(), user.avatarPath));
      console.log(file);
      return new StreamableFile(file);
    }
    throw new NotFoundException();
  }
}
