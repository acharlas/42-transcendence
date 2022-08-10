import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class JoinChannelDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password?: string;
}
