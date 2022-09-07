import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSigninDto {
  @ApiProperty({
    pattern: '^([a-zA-Z0-9]{2,7})@([a-zA-Z0-9]{2,5})\\.([a-zA-Z]{2,3})$',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
