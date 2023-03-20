import { ForbiddenException, Injectable } from '@nestjs/common';
import { Achievement, User, UserHistory } from '@prisma/client';
import { EndPoint } from 'src/game/const';
import { Playertab } from 'src/game/types_game';
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
    return new Promise<User>((resolve, reject) => {
      this.prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            ...dto,
          },
        })
        .then((user) => {
          delete user.mfaEnabled;
          delete user.mfaPhoneNumber;
          delete user.hash;
          delete user.refreshToken;
          return resolve(user);
        })
        .catch((err) => {
          return reject(err);
        });
    });
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

  async getUser(nickname: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      //console.log(nickname);
      
      this.prisma.user
        .findUnique({
          where: {
            nickname: nickname,
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
      if ((score[1] === EndPoint && score[0] === 0) || (score[0] === EndPoint && score[1] === 0)) {
        //console.log('achievement detect');
        this.GetAchievement(player[0].id)
          .then((achievementPLayerOne) => {
            this.GetAchievement(player[1].id)
              .then((achievementPLayerTwo) => {
                //console.log('achievement update: ', achievementPLayerOne, achievementPLayerTwo);
                if (
                  score[1] === EndPoint &&
                  score[0] === 0 &&
                  !achievementPLayerOne.find((ach) => {
                    return ach === Achievement.EasyWin;
                  })
                )
                  this.AddAchievement(player[0].id, Achievement.EasyWin).catch((err) => {
                    return reject(err);
                  });

                if (
                  score[0] === EndPoint &&
                  score[1] === 0 &&
                  !achievementPLayerTwo.find((ach) => {
                    return ach === Achievement.EasyWin;
                  })
                )
                  this.AddAchievement(player[1].id, Achievement.EasyWin).catch((err) => {
                    return reject(err);
                  });

                if (
                  score[1] === EndPoint &&
                  score[0] === 0 &&
                  !achievementPLayerTwo.find((ach) => {
                    return ach === Achievement.HardLoss;
                  })
                )
                  this.AddAchievement(player[1].id, Achievement.HardLoss).catch((err) => {
                    return reject(err);
                  });

                if (
                  score[0] === EndPoint &&
                  score[1] === 0 &&
                  !achievementPLayerTwo.find((ach) => {
                    return ach === Achievement.HardLoss;
                  })
                )
                  this.AddAchievement(player[0].id, Achievement.HardLoss).catch((err) => {
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
