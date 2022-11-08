import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthSignupDto {
  @ApiProperty({
    pattern: '^([a-zA-Z0-9]{2,7})@([a-zA-Z0-9]{2,5})\\.([a-zA-Z]{2,3})$',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ pattern: '^([a-zA-Z]{2,7})' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nickname?: string;
}
