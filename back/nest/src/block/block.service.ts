import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User, UserPrivilege } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockDto } from './dto';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  async addBlock(userId: string, dto: BlockDto): Promise<{ myblock: User[] }> {
    /*if (userId === dto.userId) {
      return new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "can't add yourself",
          code: '201',
        },
        HttpStatus.FORBIDDEN,
      );
    }*/
    return new Promise<{ myblock: User[] }>((resolve, reject) => {
      this.prisma.user
        .findFirst({
          where: {
            id: dto.userId,
          },
        })
        .then((ret) => {
          if (userId === dto.userId) {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: "can't add yourself",
                  code: '201',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }
          if (ret === null) {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'Must add an existing user',
                  code: '202',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }
          return resolve(
            new Promise<{ myblock: User[] }>((resolve, reject) => {
              this.prisma.user
                .findFirst({
                  where: {
                    id: userId,
                    myblock: {
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
                          error: 'already block',
                          code: '203',
                        },
                        HttpStatus.FORBIDDEN,
                      ),
                    );
                  }
                  return resolve(
                    new Promise<{ myblock: User[] }>((resolve, reject) => {
                      this.prisma.user
                        .update({
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
        });
    });
  }

  async removeBlock(
    userId: string,
    dto: BlockDto,
  ): Promise<{ myblock: User[] }> {
    return new Promise<{ myblock: User[] }>((resolve, reject) => {
      this.prisma.user
        .findFirst({
          where: {
            id: userId,
            myblock: {
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
                  error: 'no matching block',
                  code: '204',
                },
                HttpStatus.FORBIDDEN,
              ),
            );
          }
          return resolve(
            new Promise<{ myblock: User[] }>((resolve, reject) => {
              this.prisma.user
                .update({
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

  async getBlock(userId: string, id: string): Promise<{ myblock: User[] }> {
    return new Promise<{ myblock: User[] }>((resolve, reject) => {
      if (userId != id) {
        return reject(
          new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: "can't access block from a other user",
              code: '201',
            },
            HttpStatus.FORBIDDEN,
          ),
        );
      }
      const block = this.prisma.user
        .findFirst({
          where: {
            id: id,
          },
          select: {
            myblock: true,
          },
        })
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async getBlockList(
    userId: string,
  ): Promise<
    { username: string; nickname: string; privilege: UserPrivilege }[]
  > {
    return new Promise<
      { username: string; nickname: string; privilege: UserPrivilege }[]
    >((resolve, reject) => {
      this.getBlock(userId, userId)
        .then((ret) => {
          return resolve(
            ret.myblock.map((block) => {
              return {
                username: block.username,
                nickname: block.nickname,
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
