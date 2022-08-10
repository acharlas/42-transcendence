import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMsgDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  content?: string;
}
