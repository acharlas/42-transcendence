import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Channel,
  ChannelType,
  ChannelUser,
  User,
  UserPrivilege,
  UserStatus,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { connect } from 'http2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto, JoinChannelDto } from './dto';
import { GetChannelById, MessageCont, Room } from './type_channel';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(userID: string, dto: CreateChannelDto): Promise<Room> {
    return new Promise<Room>((resolve, reject) => {
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
            new Promise<Room>((resolve, reject) => {
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
                  include: {
                    users: {
                      include: {
                        user: true,
                      },
                    },
                    messages: {
                      select: {
                        content: true,
                        user: true,
                      },
                    },
                  },
                })
                .then((resp) => {
                  return resolve({
                    channel: { id: resp.id, name: resp.name, type: resp.type },
                    user: resp.users.map((user) => {
                      return {
                        username: user.user.username,
                        nickname: user.user.nickname,
                        id: user.user.id,
                        privilege: user.privilege,
                        status: user.status,
                      };
                    }),
                    message: resp.messages.map((msg) => {
                      return {
                        content: msg.content,
                        username: msg.user.username,
                        nickname: msg.user.nickname,
                      };
                    }),
                  });
                })
                .catch((err) => {
                  throw new ForbiddenException('channel already exist');
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

  async editChannel(
    userId: string,
    channelId: string,
    dto: EditChannelDto,
  ): Promise<Channel> {
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
  ): Promise<Room> {
    return new Promise<Room>((resolve, reject) => {
      console.log('join channel:', channelId);
      this.prisma.channel
        .findUnique({
          where: {
            id: channelId,
          },
        })
        .then((channel) => {
          return resolve(
            new Promise<Room>((resolve, reject) => {
              this.prisma.user
                .findUnique({ where: { id: userId } })
                .then((user) => {
                  if (channel.type === ChannelType.public)
                    return resolve(
                      new Promise<Room>((resolve, reject) => {
                        this.joinUpdateChannel(user, channel)
                          .then((room) => {
                            return resolve(room);
                          })
                          .catch((err) => {
                            return reject(err);
                          });
                      }),
                    );
                  else if (channel.type === ChannelType.protected)
                    return resolve(
                      new Promise<Room>((resolve, reject) => {
                        this.joinProtectedChannel(user, channel, dto)
                          .then((room) => {
                            return resolve(room);
                          })
                          .catch((err) => {
                            return reject(err);
                          });
                      }),
                    );
                  else if (channel.type === ChannelType.private)
                    return resolve(
                      new Promise<Room>((resolve, reject) => {
                        this.joinProtectedChannel(user, channel, dto)
                          .then((room) => {
                            return resolve(room);
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
          console.log(err);
          throw new ForbiddenException('Access to resource denied');
        });
    });
  }

  async joinProtectedChannel(
    user: User,
    channel: Channel,
    dto: JoinChannelDto,
  ): Promise<Room> {
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
    return new Promise<Room>((resolve, reject) => {
      this.joinUpdateChannel(user, channel)
        .then((room) => {
          return resolve(room);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async joinUpdateChannel(user: User, channel: Channel): Promise<Room> {
    //console.log('join channel:', channel);
    return new Promise<Room>((resolve, reject) => {
      console.log('joining channel: ', { channel }, 'user: ', { user });
      this.prisma.channelUser
        .findUnique({
          where: {
            userId_channelId: { channelId: channel.id, userId: user.id },
          },
        })
        .then((userChan) => {
          console.log('userChan find:', { userChan });
          if (userChan) {
            if (userChan.privilege === UserPrivilege.ban) {
              const date = new Date();
              console.log(date.getTime());
              console.log(userChan.time.getTime());
              if (date.getTime() < userChan.time.getTime())
                return reject(new ForbiddenException('err44'));
            }
            if (userChan.status === UserStatus.connected) {
              throw new ForbiddenException('err45');
            }
            return resolve(
              new Promise<Room>((resolve, reject) => {
                this.prisma.channelUser
                  .update({
                    where: {
                      userId_channelId: {
                        userId: userChan.userId,
                        channelId: userChan.channelId,
                      },
                    },
                    data: {
                      status: UserStatus.connected,
                      privilege: UserPrivilege.default,
                    },
                    include: {
                      channel: {
                        include: {
                          users: {
                            include: {
                              user: true,
                            },
                          },
                          messages: {
                            select: {
                              content: true,
                              user: true,
                            },
                          },
                        },
                      },
                    },
                  })
                  .then((ret) => {
                    return resolve({
                      channel: {
                        name: ret.channel.name,
                        id: ret.channel.id,
                        type: ret.channel.type,
                      },
                      user: ret.channel.users.map((user) => {
                        return {
                          username: user.user.username,
                          nickname: user.user.nickname,
                          id: user.user.id,
                          privilege: user.privilege,
                          status: user.status,
                        };
                      }),
                      message: ret.channel.messages.map((msg) => {
                        return {
                          content: msg.content,
                          username: msg.user.username,
                        };
                      }),
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    return reject(err);
                  });
              }),
            );
          } else
            return resolve(
              new Promise<Room>((resolve, reject) => {
                this.prisma.channel
                  .update({
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
                                id: user.id,
                              },
                            },
                          },
                        ],
                      },
                    },
                    include: {
                      users: {
                        include: {
                          user: true,
                        },
                      },
                      messages: {
                        select: {
                          content: true,
                          user: true,
                        },
                      },
                    },
                  })
                  .then((channel) => {
                    return resolve({
                      channel: {
                        id: channel.id,
                        name: channel.name,
                        type: channel.type,
                      },
                      user: channel.users.map((user) => {
                        return {
                          username: user.user.username,
                          nickname: user.user.nickname,
                          id: user.user.id,
                          privilege: user.privilege,
                          status: user.status,
                        };
                      }),
                      message: channel.messages.map((msg) => {
                        return {
                          content: msg.content,
                          username: msg.user.username,
                        };
                      }),
                    });
                  })
                  .catch((err) => {
                    return reject(err);
                  });
              }),
            );
        })
        .catch((err) => {
          console.log('usernotfound', err);
          return reject(err);
        });
    });
  }

  async leaveChannel(
    userId: string,
    channelId: string,
  ): Promise<ChannelUser & { user: User }> {
    return new Promise<ChannelUser & { user: User }>((resolve, reject) => {
      this.prisma.channelUser
        .update({
          where: {
            userId_channelId: { channelId: channelId, userId: userId },
          },
          data: {
            status: UserStatus.disconnected,
            privilege: UserPrivilege.default,
          },
          include: {
            user: true,
          },
        })
        .then((ret) => {
          this.prisma.channelUser
            .findMany({
              where: {
                status: UserStatus.connected,
                channelId: channelId,
              },
            })
            .then((ret) => {
              console.log(ret, ret.length);
              if (!ret || ret.length === 0) {
                this.prisma.channel
                  .deleteMany({
                    where: {
                      id: channelId,
                    },
                  })
                  .then((ret) => {
                    console.log('delete: ', ret);
                  })
                  .catch((err) => {
                    return reject(err);
                  });
              }
            })
            .catch((err) => {
              return reject(err);
            });
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
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
                user: {
                  select: {},
                },
              },
            },
          },
        })
        .then((ret) => {
          return resolve(
            ret.messages.map((elem) => {
              return {
                content: elem.content,
                username: elem.username,
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
    console.log('add message on chanelid:', channelId, ' by userid:', userId);
    return new Promise<MessageCont>((resolve, reject) => {
      this.prisma.channelUser
        .findUnique({
          where: {
            userId_channelId: { channelId: channelId, userId: userId },
          },
          include: {
            user: true,
          },
        })
        .then((res) => {
          if (res.privilege === UserPrivilege.muted) {
            const date = new Date();
            console.log(date.getTime());
            console.log(res.time.getTime());
            if (date.getTime() < res.time.getTime())
              return reject(new ForbiddenException('you are muted'));
          }
          return resolve(
            new Promise<MessageCont>((resolve, reject) => {
              if (res.privilege === 'muted' || res.privilege === 'ban')
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
                    content: ret.content,
                    username: ret.username,
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

  async channelUserUpdate(
    userId: string,
    toModified: string,
    channelId: string,
    priv: UserPrivilege,
    time: Date,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('user update type: ', priv);
      this.prisma.user
        .findUnique({
          where: {
            username: toModified,
          },
        })
        .then((userModified) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.prisma.channelUser
                .findUnique({
                  where: {
                    userId_channelId: {
                      userId,
                      channelId,
                    },
                  },
                  select: {
                    privilege: true,
                  },
                })
                .then((userPriv) => {
                  console.log('find channelUser modifie', priv);
                  if (
                    userPriv.privilege !== UserPrivilege.admin &&
                    userPriv.privilege !== UserPrivilege.owner
                  ) {
                    return new ForbiddenException("can't modifie right");
                  }
                  console.log('is admin owner');
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.prisma.channelUser
                        .findUnique({
                          where: {
                            userId_channelId: {
                              userId: userModified.id,
                              channelId,
                            },
                          },
                          select: {
                            privilege: true,
                          },
                        })
                        .then((modifPriv) => {
                          console.log(
                            'aaaaaaaaaaaaaaaaaafind channelUser modifie',
                            priv,
                          );
                          if (modifPriv.privilege === priv) return;
                          if (
                            (modifPriv.privilege === 'admin' ||
                              modifPriv.privilege === 'owner') &&
                            (priv === 'ban' || priv === 'muted')
                          )
                            return reject(
                              new ForbiddenException(
                                "can't ban/muted a admin/owner",
                              ),
                            );
                          console.log('modifie');
                          if (priv === 'ban')
                            return resolve(
                              new Promise<void>((resolve, reject) => {
                                this.banUser(userModified.id, channelId, time)
                                  .then((ret) => {
                                    return resolve(ret);
                                  })
                                  .catch((err) => {
                                    return reject(err);
                                  });
                              }),
                            );
                          else if (priv === 'muted') {
                            console.log('switch to muted');
                            return resolve(
                              new Promise<void>((resolve, reject) => {
                                this.muteUser(userModified.id, channelId, time)
                                  .then((ret) => {
                                    return resolve(ret);
                                  })
                                  .catch((err) => {
                                    return reject(err);
                                  });
                              }),
                            );
                          } else {
                            return resolve(
                              new Promise<void>((resolve, reject) => {
                                this.changeUserPrivilege(
                                  userModified.id,
                                  channelId,
                                  time,
                                  priv,
                                )
                                  .then((ret) => {
                                    return resolve(ret);
                                  })
                                  .catch((err) => {
                                    return reject(err);
                                  });
                              }),
                            );
                          }
                        })
                        .catch((err) => {
                          console.log('errror', err);
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

  async banUser(userId: string, channelId: string, Time: Date): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('ban player', userId);
      this.prisma.channelUser
        .update({
          where: {
            userId_channelId: {
              userId: userId,
              channelId,
            },
          },
          data: {
            privilege: UserPrivilege.ban,
            time: Time,
            status: UserStatus.disconnected,
          },
        })
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async muteUser(userId: string, channelId: string, Time: Date): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.prisma.channelUser
        .update({
          where: {
            userId_channelId: {
              userId: userId,
              channelId,
            },
          },
          data: {
            privilege: UserPrivilege.muted,
            time: Time,
          },
        })
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async changeUserPrivilege(
    userId: string,
    channelId: string,
    Time: Date,
    privilege: UserPrivilege,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.prisma.channelUser
        .update({
          where: {
            userId_channelId: {
              userId: userId,
              channelId,
            },
          },
          data: {
            privilege: privilege,
          },
        })
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async getChannelUser(channelId: string): Promise<
    {
      privilege: string;
      username: string;
      nickname: string;
      status: UserStatus;
    }[]
  > {
    return new Promise<
      {
        privilege: string;
        username: string;
        nickname: string;
        status: UserStatus;
      }[]
    >((resolve, reject) => {
      this.prisma.channelUser
        .findMany({
          where: {
            channelId: channelId,
          },
          select: {
            user: true,
            privilege: true,
            status: true,
          },
        })
        .then((ret) => {
          return resolve(
            ret.map((elem) => {
              return {
                privilege: elem.privilege,
                username: elem.user.username,
                nickname: elem.user.nickname,
                status: elem.status,
              };
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async getUserRoom(userId: string): Promise<Room[]> {
    return new Promise<Room[]>((resolve, reject) => {
      this.prisma.channelUser
        .findMany({
          where: {
            userId: userId,
            status: UserStatus.connected,
          },
          include: {
            channel: {
              include: {
                messages: true,
                users: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        })
        .then((ret) => {
          return resolve(
            ret.map((elem) => {
              return {
                channel: {
                  id: elem.channelId,
                  name: elem.channel.name,
                  type: elem.channel.type,
                },
                user: elem.channel.users.map((user) => {
                  return {
                    privilege: user.privilege,
                    username: user.user.username,
                    nickname: user.user.nickname,
                    id: user.user.id,
                    status: user.status,
                  };
                }),
                message: elem.channel.messages.map((msg) => {
                  return { content: msg.content, username: msg.username };
                }),
              };
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async JoinChannelByName(
    name: string,
    userId: string,
    dto: JoinChannelDto,
  ): Promise<Room> {
    return new Promise<Room>((resolve, reject) => {
      this.prisma.channel
        .findUnique({
          where: {
            name: name,
          },
          select: {
            id: true,
          },
        })
        .then((channel) => {
          if (channel) {
            return resolve(
              new Promise<Room>((resolve, reject) => {
                this.joinChannelById(userId, channel.id, dto)
                  .then((room) => {
                    return resolve(room);
                  })
                  .catch((err) => {
                    return reject(err);
                  });
              }),
            );
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async RemoveUser(userId: string, channelId: string): Promise<Channel> {
    return new Promise<Channel>((resolve, reject) => {
      this.prisma.channelUser
        .delete({
          where: { userId_channelId: { userId, channelId } },
          select: {
            channel: true,
          },
        })
        .then((chan) => {
          return resolve(chan.channel);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async CreateDm(userId: string, to: string): Promise<Room> {
    console.log('create dm with: ', userId, 'to: ', to);
    return new Promise<Room>((resolve, reject) => {
      this.prisma.channel
        .create({
          data: {
            id: userId + '__' + to,
            type: ChannelType.dm,
            name: null,
            users: {
              create: [
                {
                  privilege: UserPrivilege.default,
                  status: UserStatus.connected,
                  user: { connect: { id: userId } },
                },
                {
                  privilege: UserPrivilege.default,
                  status: UserStatus.connected,
                  user: { connect: { id: to } },
                },
              ],
            },
          },
          select: {
            type: true,
            id: true,
            messages: true,
            users: {
              include: { user: true },
            },
          },
        })
        .then((chan) => {
          return resolve({
            channel: { name: null, type: chan.type, id: chan.id },
            message: chan.messages.map((msg) => {
              return { content: msg.content, username: msg.username };
            }),
            user: chan.users.map((user) => {
              return {
                username: user.user.username,
                nickname: user.user.nickname,
                id: user.user.id,
                privilege: UserPrivilege.default,
                status: user.status,
              };
            }),
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
