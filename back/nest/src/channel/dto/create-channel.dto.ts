import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(ChannelType)
  @IsOptional()
  @ApiPropertyOptional()
  type?: ChannelType;

  @IsString()
  @Min(5)
  @Max(15)
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;
}
