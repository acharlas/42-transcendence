import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


  async getUserId(userId: string, id: string) {
    const user = await this.prisma.user.findFirst(
      { where: { id: id } },
    );
    if (user === null)
      throw new ForbiddenException(
        'no such user',
      );
    return user;
  }

  async getUsers() {
    const user = this.prisma.user.findMany();
    return user;
  }

  async getUserUsername(
    userId: string,
    id: string,
  ) {
    const user = await this.prisma.user.findFirst(
      { where: { id: id } },
    );
    if (user === null)
      throw new ForbiddenException(
        'no such user',
      );
    return user;
  }

  async editUser(
    userId: string,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    return user;
  }

  async getHistory(UserId: string) {
    const playerHistory =
      await this.prisma.user.findUnique({
        where: {
          id: UserId,
        },
        select: {
          history: true,
        },
      });
    return playerHistory;
  }
}
