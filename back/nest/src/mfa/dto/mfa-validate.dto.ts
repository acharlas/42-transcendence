import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaValidateDto {
  @ApiProperty({ pattern: '^[0-9]{6}$' })
  @Matches('^[0-9]{6}$')
  codeToCheck: string;
}
