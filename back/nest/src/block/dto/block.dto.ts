import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class BlockDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
