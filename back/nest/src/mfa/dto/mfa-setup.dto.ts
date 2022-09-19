import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaSetupDto {
  @ApiProperty({ pattern: '\\+33611223344' })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
