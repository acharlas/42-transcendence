import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  ChannelType,
  UserPrivilege,
} from '@prisma/client';
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
    const channel =
      await this.prisma.channel.create({
        data: {
          ...dto,
          users: {
            create: [
              {
                user: {
                  connect: {
                    id: userId,
                  },
                },
                privilege: UserPrivilege.owner,
              },
            ],
          },
        },
      });
    return channel;
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

  async getChannelById(
    userId: string,
    channelId: string,
  ) {}

  async editChannel(
    userId: string,
    channellId: string,
    dto: EditChannelDto,
  ) {}

  async deleteChannelById(
    userId: string,
    channelId: string,
  ) {}
}
