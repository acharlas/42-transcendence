import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PhoneNumber } from 'twilio/lib/interfaces';

import { mfaEnableDto } from './dto/mfa-enable.dto';

@Injectable()
export class MfaService {
  constructor(
    private config: ConfigService,
  ) {}

  mfaSendSms(phoneNumber: string) {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');
    const client = new Twilio(accountSid, authToken);

    const ret = client.verify.v2.services(serviceSid)
    .verifications
    .create({to: phoneNumber, channel: 'sms'});
    
    console.log("Sent 2fa sms request", ret);
  }

  async mfaCheckCode(phoneNumber: string, codeToCheck: string): Promise<boolean> {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');
    const client = new Twilio(accountSid, authToken);

    const ret = await client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({to: phoneNumber, code: codeToCheck});

    console.log("Sent 2fa code checking request", ret);

    if (ret.status === 'approved')
      return true;
    else
      return false;
  }
  
  mfaEnable(userId:string, dto: mfaEnableDto) {
    //front asks user for phone number
    //server sends sms to user
    //front asks user for 2fa code
    //user gives code to front
    //server verifies code
    //if valid code: modify user data
    //  -save phone number
    //  -set mfa as active
  }

  mfaDisable() {
    //modify user data:
    //-delete phone number
    //-set mfa as unactive
  }

  //to call when user signs in with or without oauth
  mfaSignIn() {
    //if mfa enabled:
    //server sends sms to user
    //front asks user for 2fa code
    //user gives code to front
    //server verifies code
    //if valid code: accept sign in
  }
}
