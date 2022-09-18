import { IsNumberString, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaValidateDto {
  @ApiProperty()
  @IsNumberString()
  @Matches('^[0-9]{6}$')
  codeToCheck: string;
}
