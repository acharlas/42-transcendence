import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

enum ChannelType {
  PUBLIC,
  PRIVATE,
  PROTECTED,
  DM,
}

export class EditChannelDto {
  @IsString()
  @Min(5)
  @Max(15)
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

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
