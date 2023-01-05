import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoryMatch } from './types_history';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async createhistory(createHistoryDto: CreateHistoryDto): Promise<void> {
    new Promise<void>((resolve, reject) => {
      this.prisma.history
        .create({
          data: {
            mode: createHistoryDto.mode,
          },
        })
        .then((history) => {
          createHistoryDto.score.forEach((elem) => {
            this.prisma.userHistory
              .create({
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
              })
              .then(() => {
                this.prisma.history
                  .update({
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
                  })
                  .catch((err) => {
                    return reject(err);
                  });
              })
              .catch((err) => {
                return reject(err);
              });
          });
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async getHistoryId(historyId: string) {
    const playerHistory = await this.prisma.history.findUnique({
      where: {
        id: historyId,
      },
      include: {
        user: true,
      },
    });
    return playerHistory;
  }

  async getUserHistory(userId: string): Promise<HistoryMatch[]> {
    return new Promise<HistoryMatch[]>((resolve, reject) => {
      this.prisma.userHistory
        .findMany({
          where: {
            userId: userId,
          },
          select: {
            history: {
              select: { mode: true, user: { include: { user: true } } },
            },
          },
        })
        .then((history) => {
          if (!history) return resolve(null);
          return history.map((history) => {
            return {
              gameMode: history.history.mode,
              player: history.history.user.map((user) => {
                return {
                  id: user.userId,
                  username: user.user.username,
                  score: user.yourScore,
                  placement: user.placement,
                };
              }),
            };
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
