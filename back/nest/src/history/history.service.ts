import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async createhistory(
    createHistoryDto: CreateHistoryDto,
  ) {
    const history =
      await this.prisma.history.create({
        data: {
          mode: createHistoryDto.mode,
        },
      });
    createHistoryDto.score.forEach((elem) => {
      const userhistory =
        this.prisma.userHistory.create({
          data: {
            placement: elem.placement,
            yourScore: elem.score,
            user: {
              connect: {
                id: elem.id,
              },
            },
            history: {
              connect: {
                id: history.id,
              },
            },
          },
        });
      this.prisma.history.update({
        where: {
          id: history.id,
        },
        data: {
          user: {
            connect: {
              userId_historyId: {
                userId: elem.id,
                historyId: history.id,
              },
            },
          },
        },
      });
    });
    return history;
  }

  async getHistoryId(historyId: string) {
    const playerHistory =
      await this.prisma.history.findUnique({
        where: {
          id: historyId,
        },
        include: {
          user: true,
        },
      });
    return playerHistory;
  }
}
