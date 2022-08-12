import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendDto } from './dto';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async addFriend(
    userId: string,
    dto: FriendDto,
  ) {
    if (userId === dto.userId)
      throw new ForbiddenException(
        "can't add yourself",
      );
    let friend = await this.prisma.user.findFirst(
      {
        where: {
          id: dto.userId,
        },
      },
    );
    if (friend === null) {
      throw new ForbiddenException(
        'Must add an existing user',
      );
    }
    friend = await this.prisma.user.findFirst({
      where: {
        id: userId,
        myfriend: {
          some: {
            id: dto.userId,
          },
        },
      },
    });
    if (friend !== null) {
      throw new ForbiddenException(
        'already friend',
      );
    }
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        myfriend: {
          connect: {
            id: dto.userId,
          },
        },
      },
      select: {
        myfriend: true,
      },
    });
    return user;
  }

  async removeFriend(
    userId: string,
    dto: FriendDto,
  ) {
    const friend =
      await this.prisma.user.findFirst({
        where: {
          id: userId,
          myfriend: {
            some: { id: dto.userId },
          },
        },
      });
    if (friend === null) {
      throw new ForbiddenException(
        'no matching friend',
      );
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        myfriend: {
          disconnect: {
            id: dto.userId,
          },
        },
      },
      select: {
        myfriend: true,
      },
    });
    return user;
  }

  async getFriend(userId: string, id: string) {
    if (userId !== id) {
      throw new ForbiddenException(
        "can't access friend from a other user",
      );
    }
    const friend = this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        myfriend: true,
      },
    });
    return friend;
  }
}
