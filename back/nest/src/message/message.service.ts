import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  messages: CreateMessageDto[] = [{ name: 'Toto', content: 'coucou' }];
  clientToUser = {};

  async create_channel(channelName: string): Promise<Channel> {
    const channel = await this.prisma.channel.create({
      data: {
        name: channelName,
        type: 'public',
      },
    });
    return channel;
  }

  async findAll(): Promise<CreateMessageDto[]> {
    return this.messages;
  }

  async identify(name: string, clientId: string): Promise<unknown[]> {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  async getClientName(clientId: string): Promise<string> {
    return this.clientToUser[clientId];
  }
}
