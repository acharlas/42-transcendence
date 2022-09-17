import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaSetupDto {
  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
