import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaValidateDto {
  @ApiProperty()
  @Matches('^[0-9]{6}$')
  codeToCheck: string;
}
