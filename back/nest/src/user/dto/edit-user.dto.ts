import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nickname?: string;
}
