import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, isString, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
