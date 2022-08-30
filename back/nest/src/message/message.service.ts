import { ForbiddenException, Injectable } from '@nestjs/common';
import { prisma, UserPrivilege, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  // async postMessage(userId: string, channelId: string, dto: CreateMessageDto) {
  //   const channel = await this.prisma.channel.findUnique({
  //     where: {
  //       id: channelId,
  //     },
  //   });
  //   if (!channelId) {
  //     throw new ForbiddenException('Access to resources denied');
  //   }
  //   const channelUser = await this.prisma.channelUser.findUnique({
  //     where: {
  //       userId_channelId: {
  //         userId,
  //         channelId,
  //       },
  //     },
  //   });
  //   if (
  //     !channelUser ||
  //     channelUser.privilege === UserPrivilege.ban ||
  //     channelUser.privilege === UserPrivilege.muted ||
  //     channelUser.status === UserStatus.disconnected
  //   ) {
  //     throw new ForbiddenException('Access to resource denied');
  //   }

  //   const createdMessage = await this.prisma.message.create({
  //     data: {
  //       content: dto.content,
  //       user: {
  //         connect: {
  //           id: userId,
  //         },
  //       },
  //       channel: {
  //         connect: {
  //           id: channelId,
  //         },
  //       },
  //     },
  //   });
  //   await this.prisma.channel.update({
  //     where: {
  //       id: channelId,
  //     },
  //     data: {
  //       messages: {
  //         connect: {
  //           id: createdMessage.id,
  //         },
  //       },
  //     },
  //   });

  //   return createdMessage;
  // }

  // async getMessagesfromChannel(channelId: string) {
  //   return await this.prisma.message.findMany({
  //     where: {
  //       channelId,
  //     },
  //   });
  // }

  // async getMessageById(channelId: string, messageId: string) {
  //   return await this.prisma.message.findUnique({
  //     where: {
  //       channelId_id: {
  //         channelId,
  //         id: messageId,
  //       },
  //     },
  //   });
  // }

  messages: CreateMessageDto[] = [{ name: 'Toto', content: 'coucou' }];
  clientToUser = {};

  async create(createMessageDto: CreateMessageDto): Promise<CreateMessageDto> {
    const message = { ...createMessageDto };
    this.messages.push(createMessageDto);
    return message;
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
