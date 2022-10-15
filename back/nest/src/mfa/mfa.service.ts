import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaValidateDto } from './dto/mfa-validate.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';

@Injectable()
export class MfaService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  async mfaSendSms(phoneNumber: string): Promise<boolean> {
    //TMP
    return true; //to test stuff without calling external API
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');
    const client = new Twilio(accountSid, authToken);

    client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' },
        function (err, message) {
          if (err) {
            console.log(err);
            return (true);
          } else {
            console.log('Sent 2fa request to ' + message.to);
            return (false);
          }
        }
      );
    return (true);
  }

  async mfaCheckCode(phoneNumber: string, codeToCheck: string): Promise<boolean> {
    //TMP
    return true; //to test stuff without calling external API
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');
    const client = new Twilio(accountSid, authToken);

    const ret = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code: codeToCheck },
        function (err, message) {
          if (err) {
            console.log(err);
            return (true);
          } else {
            return (false);
          }
        });

    console.log("Sent 2fa code checking request", ret);

    if (ret.status === 'approved')
      return true;
    else
      return false;
  }

  async initSetup(userId: string, dto: MfaSetupDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId }, })
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === true) throw new ForbiddenException('mfa already enabled');

    this.mfaSendSms(dto.phoneNumber);

    //success: add phone number
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaPhoneNumber: dto.phoneNumber,
      },
    });
  }

  async finishSetup(userId: string, dto: MfaValidateDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === true) throw new ForbiddenException('mfa already enabled');
    if (user.mfaPhoneNumber === null) throw new ForbiddenException('no phone number');

    this.mfaCheckCode(user.mfaPhoneNumber, dto.codeToCheck);

    //success: set mfa as enabled
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
      },
    });
  }

  async initSignIn(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === false) throw new ForbiddenException('mfa not enabled');
    if (user.mfaPhoneNumber === null) throw new ForbiddenException('no phone number');

    const success = await this.mfaSendSms(user.mfaPhoneNumber);
    if (success) {
      console.log("mfa init signin ok");
    } else {
      console.log("mfa init signin failed");
    }
    //success:
    //front must redirect to challenge page
  }

  async signToken(userId: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      fullyAuth: true,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async validateSignIn(userId: string, dto: MfaValidateDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === false) throw new ForbiddenException('mfa not enabled');
    if (user.mfaPhoneNumber === null) throw new ForbiddenException('no phone number');

    const success = await this.mfaCheckCode(user.mfaPhoneNumber, dto.codeToCheck);

    if (success) {
      console.log("mfa setup signin ok");
      const token = this.signToken(userId);
      console.log(await token);

      return token;
    } else {
      console.log("mfa setup signin failed");
    }

    //success:
    //return new auth token
    //front must save auth token
  }

  async disable(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaPhoneNumber: null
      },
    });
    return user;
  }
}

//  MFA server-side flow:

// *** Activating MFA: ***

// ** phase 1: initiate **
// receive phone number from authed user
// if (user not authed) -> error
// if (user has mfa enabled) -> error
// ask verif API to send code via sms to user
// if (API error) -> error
// store provisional phone number
// success
// -> front: send user to verification page

// ** phase 2: validate phone number **
// receive code + userid
// if (user not authed) -> error
// if (user doesn't have a provisional phone number) -> error
// send code + phone number to verif API
// if ("status" != "approved") -> error
// -success-
// -> set mfa as activated for this user
// -> issue new JWT?
// -> front: sends user to login page

// *** Enforcing MFA: ***

// on log in:
// -first factor auth
// if (mfa enabled for user) -> 2fa challenge

// *** initiate 2fa challenge: ***
// if (2fa not enabled || no phone number) -> error
// send phone number to verif API
// check API response

// *** 2fa challenge: ***
// receive code + userid
// find phone number from DB
// send code + phone number to verif API
// if ("status" != "approved") -> error
// -success-
// -> issue JWT with a field specifying 2fa is done
