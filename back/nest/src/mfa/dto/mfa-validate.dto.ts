import { IsNumberString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaValidateDto {
  @ApiProperty()
  @IsString()
  @IsNumberString()
  codeToCheck: number;
}
