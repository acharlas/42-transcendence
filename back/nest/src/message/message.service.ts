import { ForbiddenException, Injectable } from '@nestjs/common';
import { prisma, UserPrivilege, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

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
