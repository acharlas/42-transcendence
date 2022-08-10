import {
  Get,
  Module,
  Param,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';

@Module({
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
