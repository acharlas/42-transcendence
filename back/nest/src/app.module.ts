import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendModule } from './friend/friend.module';
import { BlockModule } from './block/block.module';
import { HistoryModule } from './history/history.module';
import { MessageModule } from './message/message.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    PrismaModule,
    FriendModule,
    BlockModule,
    HistoryModule,
    MessageModule,
    LeaderboardModule,
    JwtModule,
  ],
})
export class AppModule {}
