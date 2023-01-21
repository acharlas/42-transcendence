import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, UserHistory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserId(userId: string, id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id: id } });
    if (user === null) throw new ForbiddenException('no such user');
    return user;
  }

  async getUsers(): Promise<User[]> {
    const user = this.prisma.user.findMany();
    return user;
  }

  async getUserUsername(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id: id } });
    if (user === null) throw new ForbiddenException('no such user');
    return user;
  }

  async editUser(userId: string, dto: EditUserDto): Promise<User> {
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

  async getHistory(UserId: string): Promise<{ history: UserHistory[] }> {
    const playerHistory = await this.prisma.user.findUnique({
      where: {
        id: UserId,
      },
      select: {
        history: true,
      },
    });
    return playerHistory;
  }

  async getUser(username: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.prisma.user
        .findUnique({
          where: {
            username: username,
          },
        })
        .then((user) => {
          return resolve(user);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
