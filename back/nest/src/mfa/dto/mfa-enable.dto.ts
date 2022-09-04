import { IsNumberString, IsPhoneNumber, IsString } from 'class-validator';
import internal from 'stream';

export class mfaEnableDto {
  @IsString()
  @IsNumberString()
  codeToCheck: number;

  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
