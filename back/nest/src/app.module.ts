import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelUserModule } from './channel-user/channel-user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MsgModule } from './msg/msg.module';
import { FriendModule } from './friend/friend.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    ChannelUserModule,
    PrismaModule,
    MsgModule,
    FriendModule,
    BlockModule,
  ],
})
export class AppModule {}
