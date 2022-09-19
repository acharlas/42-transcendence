import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Channel,
  ChannelType,
  ChannelUser,
  Message,
  UserPrivilege,
  UserStatus,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto, JoinChannelDto } from './dto';
import { GetChannelById, MessageCont } from './type_channel';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(userID: string, dto: CreateChannelDto): Promise<Channel> {
    return new Promise<Channel>((resolve, reject) => {
      let hash = null;
      if (dto.type === ChannelType.protected) {
        if (dto.password === undefined || dto.password === null) {
          throw new ForbiddenException(
            'Cannot create protected channel without password',
          );
        }
      }
      argon
        .hash(dto.password)
        .then((res) => {
          return resolve(
            new Promise<Channel>((resolve, reject) => {
              this.prisma.channel
                .create({
                  data: {
                    name: dto.name,
                    type: dto.type,
                    hash: res,
                    users: {
                      create: [
                        {
                          privilege: UserPrivilege.owner,
                          status: UserStatus.connected,
                          user: {
                            connect: {
                              id: userID,
                            },
                          },
                        },
                      ],
                    },
                  },
                })
                .then((resp) => {
                  return resolve(resp);
                })
                .catch((err) => {
                  return reject(new ForbiddenException(403));
                });
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async getChannels(userId: string): Promise<
    {
      type: ChannelType;
      name: string;
      id: string;
    }[]
  > {
    return new Promise<
      {
        type: ChannelType;
        name: string;
        id: string;
      }[]
    >((resolve, reject) => {
      this.prisma.channel
        .findMany({
          where: {
            type: {
              not: 'private',
            },
          },
          select: {
            type: true,
            name: true,
            id: true,
          },
        })
        .then((ret) => {
          return resolve(
            new Promise<
              {
                type: ChannelType;
                name: string;
                id: string;
              }[]
            >((resolve, reject) => {
              this.prisma.channel
                .findMany({
                  where: {
                    type: 'private',
                    users: {
                      some: {
                        userId: userId,
                      },
                    },
                  },
                  select: {
                    type: true,
                    name: true,
                    id: true,
                  },
                })
                .then((res) => {
                  res.map((elem) => {
                    ret.push(elem);
                  });
                  return resolve(ret);
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
        })
        .catch((err) => {
          return reject(new BadRequestException('Cannot find ressource'));
        });
    });
  }

  async getChannelById(channelId: string): Promise<GetChannelById> {
    return new Promise<GetChannelById>((resolve, reject) => {
      this.prisma.channel
        .findUnique({
          where: { id: channelId },
          include: {
            users: {
              select: {
                userId: true,
                user: {
                  select: {
                    nickname: true,
                  },
                },
              },
            },
          },
        })
        .then((ret) => {
          delete ret.hash;
          return resolve(ret);
        })
        .catch((err) => {
          return reject(new ForbiddenException('Access to resource denied'));
        });
    });
  }

  async editChannel(userId: string, channelId: string, dto: EditChannelDto) {
    let hash = null;
    if (dto.type === ChannelType.protected) {
      if (dto.password === undefined || dto.password === null) {
        throw new ForbiddenException(
          'Cannot update protected channel without password',
        );
      }
      hash = await argon.hash(dto.password);
    }
    //get channel by id
    const channel = await this.getChannelById(channelId);
    const getUserPrivilege = await this.prisma.channelUser.findFirst({
      where: {
        channelId,
        userId,
      },
    });
    //check if user is owner
    if (
      !channel ||
      !getUserPrivilege ||
      getUserPrivilege.privilege !== UserPrivilege.owner
    ) {
      throw new ForbiddenException('Access to resources denied');
    }
    try {
      return await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          name: dto.name,
          type: dto.type,
          hash: hash,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Name already taken');
        }
      }
      throw e;
    }
  }

  async deleteChannelById(userId: string, channelId: string) {
    const channel = await this.getChannelById(channelId);
    const getUserPrivilege = await this.prisma.channelUser.findFirst({
      where: {
        channelId,
        userId,
      },
    });
    if (
      !channel ||
      !getUserPrivilege ||
      getUserPrivilege.privilege !== UserPrivilege.owner
    ) {
      throw new ForbiddenException('Access to resources denied');
    }
    return await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
  }

  async joinChannelById(
    userId: string,
    channelId: string,
    dto: JoinChannelDto,
  ) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new ForbiddenException('Access to resource denied');
    }
    if (channel.type === ChannelType.public)
      return await this.joinPublicChannel(userId, channel);
    if (channel.type === ChannelType.protected)
      return await this.joinProtectedChannel(userId, channel, dto);
  }

  async joinPublicChannel(userId: string, channel: Channel) {
    const channelUser = await this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId,
          channelId: channel.id,
        },
      },
    });

    return await this.joinUpdateChannel(userId, channel, channelUser);
  }

  async joinProtectedChannel(
    userId: string,
    channel: Channel,
    dto: JoinChannelDto,
  ) {
    if (
      dto.password === null ||
      dto.password === undefined ||
      dto.password === ''
    ) {
      throw new ForbiddenException('Password incorrect');
    }
    const pwMathes = await argon.verify(channel.hash, dto.password);
    if (!pwMathes) {
      throw new ForbiddenException('Password incorrect');
    }
    const channelUser = await this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId,
          channelId: channel.id,
        },
      },
    });
    return await this.joinUpdateChannel(userId, channel, channelUser);
  }

  async joinUpdateChannel(
    userId: string,
    channel: Channel,
    channelUser: ChannelUser,
  ) {
    if (!channelUser) {
      return await this.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          users: {
            create: [
              {
                privilege: UserPrivilege.default,
                status: UserStatus.connected,
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
            ],
          },
        },
      });
    } else {
      return await this.prisma.channelUser.update({
        where: {
          userId_channelId: {
            userId,
            channelId: channel.id,
          },
        },
        data: {
          status: UserStatus.connected,
        },
      });
    }
  }

  async leaveChannel(userId: string, channelId: string) {
    const channel = await this.getChannelById(channelId);

    if (!channel) {
      throw new ForbiddenException('Access to resource denied');
    }

    const channelUser = await this.prisma.channelUser.findUnique({
      where: {
        userId_channelId: {
          userId,
          channelId: channel.id,
        },
      },
    });
    if (!channelUser) {
      throw new ForbiddenException('You are not on the channel');
    }
    if (channelUser.status === UserStatus.disconnected) {
      throw new ForbiddenException('Already left the channel');
    }

    return await this.prisma.channelUser.update({
      where: {
        userId_channelId: {
          userId,
          channelId,
        },
      },
      data: {
        status: UserStatus.disconnected,
      },
    });
  }

  async getChannelMessage(
    channelId: string,
    userId: string,
  ): Promise<MessageCont[]> {
    return new Promise<MessageCont[]>((resolve, reject) => {
      this.prisma.channel
        .findFirst({
          where: {
            id: channelId,
          },
          include: {
            messages: {
              include: {
                user: true,
              },
            },
          },
        })
        .then((ret) => {
          return resolve(
            ret.messages.map((elem) => {
              return {
                nickname: elem.user.nickname,
                username: elem.username,
                content: elem.content,
              };
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async addChannelMessage(
    userId: string,
    channelId: string,
    username: string,
    content: string,
  ): Promise<MessageCont> {
    console.log('chanelid:', channelId, 'userid:', userId);
    return new Promise<MessageCont>((resolve, reject) => {
      this.prisma.channelUser
        .findUnique({
          where: {
            userId_channelId: { channelId: channelId, userId: userId },
          },
        })
        .then((ret) => {
          return resolve(
            new Promise<MessageCont>((resolve, reject) => {
              if (ret.privilege === 'muted' || ret.privilege === 'ban')
                return reject(
                  new ForbiddenException("this user can't post message"),
                );
              this.prisma.message
                .create({
                  data: {
                    content: content,
                    username: username,
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                    channel: {
                      connect: {
                        id: channelId,
                      },
                    },
                  },
                })
                .then((ret) => {
                  return resolve({
                    username: ret.username,
                    nickname: ret.username,
                    content: ret.content,
                  });
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
        })
        .catch((err) => {
          console.log({ err });
          return reject(new ForbiddenException("user isn't on channel"));
        });
    });
  }
}
