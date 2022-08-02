import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/common/dtos/abstract.dto';
import { ChannelUsers } from 'src/entities/channelUsers.entity';
import { Message } from 'src/entities/message.entity';
import { UserEntity, UserStatus } from '../entities/user.entity';


export class UserDto extends AbstractDto  {
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

  constructor(user: UserEntity) {
    super(user);
    this.username = user.username;
    this.nickname = user.nickname;
    this.status = user.status;
    this.wins = user.wins;
    this.losses = user.losses;
  }
}
