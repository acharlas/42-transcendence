import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  ChannelType,
  UserPrivilege,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { type } from 'os';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateChannelDto,
  EditChannelDto,
} from './dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(
    userId: string,
    dto: CreateChannelDto,
  ) {
    try {
      let hash = null;
      if (dto.type === ChannelType.protected) {
        if (
          dto.password === undefined ||
          dto.password === null
        ) {
          throw new ForbiddenException(
            'Cannot create protected channel without password',
          );
        }
        hash = await argon.hash(dto.password);
      }
      const channel =
        await this.prisma.channel.create({
          data: {
            name: dto.name,
            type: dto.type,
            hash: hash,
            users: {
              create: [
                {
                  privilege: UserPrivilege.owner,
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
      if (
        e instanceof PrismaClientKnownRequestError
      ) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Name already taken',
          );
        }
      }
      throw e;
    }
  }

  async getChannels(type: ChannelType) {
    if (type === 'dm') {
      throw new BadRequestException(
        'Cannot find ressource',
      );
    }
    try {
      return await this.prisma.channel.findMany({
        where: {
          type: type,
        },
      });
    } catch (e) {
      throw new BadRequestException(
        'Cannot find ressource',
      );
    }
  }

  async getChannelById(channelId: string) {
    return await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
  }

  async editChannel(
    userId: string,
    channelId: string,
    dto: EditChannelDto,
  ) {
    let hash = null;
    if (dto.type === ChannelType.protected) {
      if (
        dto.password === undefined ||
        dto.password === null
      ) {
        throw new ForbiddenException(
          'Cannot update protected channel without password',
        );
      }
      hash = await argon.hash(dto.password);
    }
    //get channel by id
    const channel =
      await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
    const getUserPrivilege =
      await this.prisma.channelUser.findFirst({
        where: {
          channelId,
          userId,
        },
      });
    //check if user is owner
    if (
      !channel ||
      !getUserPrivilege ||
      getUserPrivilege.privilege !==
        UserPrivilege.owner
    ) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
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
      if (
        e instanceof PrismaClientKnownRequestError
      ) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Name already taken',
          );
        }
      }
      throw e;
    }
  }

  async deleteChannelById(
    userId: string,
    channelId: string,
  ) {
    const channel =
      await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
    const getUserPrivilege =
      await this.prisma.channelUser.findFirst({
        where: {
          channelId,
          userId,
        },
      });
    if (
      !channel ||
      !getUserPrivilege ||
      getUserPrivilege.privilege !==
        UserPrivilege.owner
    ) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }
    return await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
  }
}
