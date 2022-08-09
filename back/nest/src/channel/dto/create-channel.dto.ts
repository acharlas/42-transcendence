import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  NotEquals,
} from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    pattern: '^([a-zA-Z0-9]{2,10})',
  })
  name: string;

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