import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @MinLength(1)
  username?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @MinLength(1)
  nickname?: string;
}
