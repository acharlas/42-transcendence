import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditChannelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    pattern: '^([a-zA-Z0-9]{2,10})',
  })
  name?: string;

  @IsEnum(ChannelType)
  @IsOptional()
  @ApiPropertyOptional({
    enum: ChannelType,
  })
  type?: ChannelType;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password?: string;
}
