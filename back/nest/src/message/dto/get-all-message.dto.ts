import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  channelId: string;
}
