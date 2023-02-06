import { ForbiddenException, Injectable } from '@nestjs/common';
import { Achievement, User, UserHistory } from '@prisma/client';
import { Lobby, Player, Playertab } from 'src/game/types_game';
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

  async GetAchievement(userId: string): Promise<Achievement[]> {
    return new Promise<Achievement[]>((resolve, reject) => {
      this.prisma.user
        .findUnique({
          where: {
            id: userId,
          },
        })
        .then((user) => {
          return resolve(user.achievement);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async AddAchievement(userId: string, achievement: Achievement): Promise<Achievement[]> {
    return new Promise<Achievement[]>((resolve, reject) => {
      this.prisma.user
        .findUnique({
          where: {
            id: userId,
          },
        })
        .then((user) => {
          if (
            user.achievement.find((ach) => {
              return ach === achievement;
            })
          )
            return reject(new ForbiddenException('achievement already add'));
          return resolve(
            new Promise<Achievement[]>((resolve, reject) => {
              const newAchievement = user.achievement;
              newAchievement.push(achievement);
              this.prisma.user
                .update({
                  where: { id: user.id },
                  data: {
                    achievement: newAchievement,
                  },
                })
                .then(() => {
                  return resolve(newAchievement);
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async AchievementUpdate(player: Playertab[], score: number[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if ((score[1] === 2 && score[0] === 0) || (score[0] === 2 && score[1] === 0)) {
        console.log('achievement detect');
        this.GetAchievement(player[0].id)
          .then((achievementPLayerOne) => {
            this.GetAchievement(player[1].id)
              .then((achievementPLayerTwo) => {
                console.log('achievement update: ', achievementPLayerOne, achievementPLayerTwo);
                if (
                  score[1] === 2 &&
                  score[0] === 0 &&
                  !achievementPLayerOne.find((ach) => {
                    return ach === Achievement.EasyWin;
                  })
                )
                  this.AddAchievement(player[0].id, Achievement.EasyWin).catch((err) => {
                    return reject(err);
                  });

                if (
                  score[0] === 2 &&
                  score[1] === 0 &&
                  !achievementPLayerTwo.find((ach) => {
                    return ach === Achievement.EasyWin;
                  })
                )
                  this.AddAchievement(player[1].id, Achievement.EasyWin).catch((err) => {
                    return reject(err);
                  });

                if (
                  score[1] === 2 &&
                  score[0] === 0 &&
                  !achievementPLayerTwo.find((ach) => {
                    return ach === Achievement.HardLosse;
                  })
                )
                  this.AddAchievement(player[1].id, Achievement.HardLosse).catch((err) => {
                    return reject(err);
                  });

                if (
                  score[0] === 2 &&
                  score[1] === 0 &&
                  !achievementPLayerTwo.find((ach) => {
                    return ach === Achievement.HardLosse;
                  })
                )
                  this.AddAchievement(player[0].id, Achievement.HardLosse).catch((err) => {
                    return reject(err);
                  });
                return resolve();
              })
              .catch((err) => {
                return reject(err);
              });
          })
          .catch((err) => {
            return reject(err);
          });
      }
    });
  }
}
