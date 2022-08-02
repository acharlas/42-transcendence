import { ApiProperty } from '@nestjs/swagger';
import { ChannelUsers } from 'src/entities/channelUsers.entity';
import { Message } from 'src/entities/message.entity';
import { UserEntity, UserStatus } from '../entities/user.entity';


export class UserDto  {
  @ApiProperty()
  username: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  wins: number;

  @ApiProperty()
  losses: number;

  channels: ChannelUsers[];
  friends: UserEntity[];
  blocked: UserEntity[];
  messages: Message[];
}
