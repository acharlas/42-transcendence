import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class FriendDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
