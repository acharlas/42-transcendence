import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Channel,
  ChannelType,
  ChannelUser,
  UserPrivilege,
  UserStatus,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, EditChannelDto, JoinChannelDto } from './dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(userId: string, dto: CreateChannelDto) {
    try {
      let hash = null;
      if (dto.type === ChannelType.protected) {
        if (dto.password === undefined || dto.password === null) {
          throw new ForbiddenException(
            'Cannot create protected channel without password',
          );
        }
        hash = await argon.hash(dto.password);
      }
      const channel = await this.prisma.channel.create({
        data: {
          name: dto.name,
          type: dto.type,
          hash: hash,
          users: {
            create: [
              {
                privilege: UserPrivilege.owner,
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
      return channel;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Name already taken');
        }
      }
      throw e;
    }
  }

  async getChannels(type: ChannelType) {
    if (type === 'dm') {
      throw new BadRequestException('Cannot find ressource');
    }
    try {
      return await this.prisma.channel.findMany({
        where: {
          type: type,
        },
      });
    } catch (e) {
      throw new BadRequestException('Cannot find ressource');
    }
  }

  async getChannelById(channelId: string) {
    const channel = await this.prisma.channel.findUnique({
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
    });
    if (!channel) {
      throw new ForbiddenException('Access to resource denied');
    }
    delete channel.hash;
    return channel;
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
}
