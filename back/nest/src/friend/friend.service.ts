import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User, UserPrivilege } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FriendDto } from './dto';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async addFriend(
    userId: string,
    dto: FriendDto,
  ): Promise<{ myfriend: User[] }> {
    console.log('add friend', dto.userId);
    return new Promise<{ myfriend: User[] }>((resolve, reject) => {
      if (userId === dto.userId) {
        return reject(
          new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: "can't add yourself",
              code: '301',
            },
            HttpStatus.FORBIDDEN,
          ),
        );
      }
      this.prisma.user
        .findFirst({
          where: {
            id: dto.userId,
          },
        })
        .then((ret) => {
          if (ret === null) {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'Must add an existing user',
                  code: '302',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }
          return resolve(
            new Promise<{ myfriend: User[] }>((resolve, reject) => {
              this.prisma.user
                .findFirst({
                  where: {
                    id: userId,
                    myfriend: {
                      some: {
                        id: dto.userId,
                      },
                    },
                  },
                })
                .then((res) => {
                  if (res !== null) {
                    return reject(
                      new HttpException(
                        {
                          status: HttpStatus.FORBIDDEN,
                          error: 'already friend',
                          code: '303',
                        },
                        HttpStatus.FORBIDDEN,
                      ),
                    );
                  }
                  return resolve(
                    new Promise<{ myfriend: User[] }>((resolve, reject) => {
                      this.prisma.user
                        .update({
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
                        })
                        .then((response) => {
                          return resolve(response);
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
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async removeFriend(
    userId: string,
    dto: FriendDto,
  ): Promise<{ myfriend: User[] }> {
    return new Promise<{ myfriend: User[] }>((resolve, reject) => {
      this.prisma.user
        .findFirst({
          where: {
            id: userId,
            myfriend: {
              some: { id: dto.userId },
            },
          },
        })
        .then((ret) => {
          if (ret === null) {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'no matching friend',
                  code: '304',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }
          return resolve(
            new Promise<{ myfriend: User[] }>((resolve, reject) => {
              this.prisma.user
                .update({
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
                })
                .then((res) => {
                  return resolve(res);
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

  async getFriend(userId: string, id: string): Promise<{ myfriend: User[] }> {
    console.log('getFriend');
    return new Promise<{ myfriend: User[] }>((resolve, reject) => {
      if (userId !== id) {
        return reject(
          new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: "can't access friend from a other user",
              code: '301',
            },
            HttpStatus.FORBIDDEN,
          ),
        );
      }
      this.prisma.user
        .findFirst({
          where: {
            id: id,
          },
          select: {
            myfriend: true,
          },
        })
        .then((ret) => {
          return resolve(ret);
        });
    });
  }

  async getFriendList(
    userId: string,
  ): Promise<
    { username: string; nickname: string; privilege: UserPrivilege }[]
  > {
    return new Promise<
      { username: string; nickname: string; privilege: UserPrivilege }[]
    >((resolve, reject) => {
      this.getFriend(userId, userId)
        .then((ret) => {
          return resolve(
            ret.myfriend.map((friend) => {
              return {
                username: friend.username,
                nickname: friend.nickname,
                privilege: UserPrivilege.default,
              };
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
