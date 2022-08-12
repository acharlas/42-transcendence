import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard() {
    const users = await this.prisma.user.findMany(
      {
        orderBy: {
          mmr: 'asc',
        },
      },
    );
    users.map((u) => {
      delete u.hash;
    });
    return users;
  }
}
