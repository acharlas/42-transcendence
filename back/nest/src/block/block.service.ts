import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockDto } from './dto';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  async addBlock(userId: string, dto: BlockDto) {
    if (userId === dto.userId)
      throw new ForbiddenException(
        "can't add yourself",
      );
    let block = await this.prisma.user.findFirst({
      where: {
        id: dto.userId,
      },
    });
    console.log({ block });
    if (block === null) {
      throw new ForbiddenException(
        'Must add an existing user',
      );
    }
    block = await this.prisma.user.findFirst({
      where: {
        id: userId,
        myblock: {
          some: {
            id: dto.userId,
          },
        },
      },
    });
    console.log({ block });
    if (block !== null) {
      throw new ForbiddenException(
        'already block',
      );
    }
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        myblock: {
          connect: {
            id: dto.userId,
          },
        },
      },
      select: {
        myblock: true,
      },
    });
    return user;
  }

  async removeBlock(
    userId: string,
    dto: BlockDto,
  ) {
    const block =
      await this.prisma.user.findFirst({
        where: {
          id: userId,
          myblock: {
            some: { id: dto.userId },
          },
        },
      });
    console.log({ block });
    if (block === null) {
      throw new ForbiddenException(
        'no matching block',
      );
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        myblock: {
          disconnect: {
            id: dto.userId,
          },
        },
      },
      select: {
        myblock: true,
      },
    });
    return user;
  }

  async getBlock(userId: string, id: string) {
    if (userId != id) {
      throw new ForbiddenException(
        "can't access block from a other user",
      );
    }
    const block = this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        myblock: true,
      },
    });
    return block;
  }
}
