import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  isString,
  IsString,
} from 'class-validator';

export class HistoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string[];

  @IsNumber()
  nbPlayer: number;

  @IsString()
  winner: string;

  @IsString()
  score: string;
}
