import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
      this.channelUser.deleteMany(),
      this.channel.deleteMany(),
      this.message.deleteMany(),
      this.history.deleteMany(),
      this.userHistory.deleteMany()
    ]);
  }
}
