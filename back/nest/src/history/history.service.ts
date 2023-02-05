import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { updateRankingsDto } from './dto/update-rankings-dto';
import { HistoryMatch } from './types_history';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) { }

  async createhistory(createHistoryDto: CreateHistoryDto): Promise<void> {
    new Promise<void>((resolve, reject) => {
      console.log("createhistory service");
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
              select: {
                createdAt: true,
                mode: true,
                user: { include: { user: true } },
              },
            },
          },
        })
        .then((history) => {
          if (!history) {
            return resolve(null);
          }
          const hist = history.map((history) => {
            return {
              date: history.history.createdAt,
              gameMode: history.history.mode,
              player: history.history.user.map((user) => {
                return {
                  id: user.userId,
                  userName: user.user.username,
                  score: user.yourScore,
                  placement: user.placement,
                };
              }),
            };
          });
          return resolve(hist);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // MMR stuff
  async editElo(
    userId: string,
    newMmr: number,
  ) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        mmr: newMmr,
      },
    });
  }

  async incrementWins(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wins: {increment: 1},
      },
    });
  }

  async incrementLosses(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        losses: {increment: 1},
      },
    });
  }

  async getElo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    });
    return user.mmr;
  }

  //updates MMR and W/L for both players
  async updateRankings(gameData: updateRankingsDto) {
    console.log("updateRanking");
    console.log(gameData);

    this.incrementWins(gameData.winnerId);
    this.incrementLosses(gameData.loserId);

    var EloRank = require('elo-rank');
    var elo = new EloRank(24);

    var winnerMmr = await this.getElo(gameData.winnerId);
    var loserMmr = await this.getElo(gameData.loserId);
    console.log("old MMR:", winnerMmr, loserMmr);

    const winnerExpectedScore = elo.getExpected(winnerMmr, loserMmr);
    const loserExpectedScore = elo.getExpected(loserMmr, winnerMmr);

    winnerMmr = elo.updateRating(winnerExpectedScore, 1, winnerMmr);
    loserMmr = elo.updateRating(loserExpectedScore, 0, loserMmr);
    console.log("new MMR:", winnerMmr, loserMmr);
  
    this.editElo(gameData.winnerId, await winnerMmr);
    this.editElo(gameData.loserId, await loserMmr);
  }
}
