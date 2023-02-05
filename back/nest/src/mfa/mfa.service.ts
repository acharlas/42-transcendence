import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaValidateDto } from './dto/mfa-validate.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MfaService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private authService: AuthService,
  ) {}

  async mfaSendSms(phoneNumber: string): Promise<boolean> {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');
    const client = require('twilio')(accountSid, authToken);

    return new Promise<boolean>((resolve, reject) => {
      client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' })
        .then(
          (verification) => {
            console.log(verification);
            return resolve(true);
          },
          (e) => {
            console.log(e);
            return reject(new ForbiddenException('2fa request failed'));
          },
        );
    });
  }

  async mfaCheckCode(phoneNumber: string, codeToCheck: string): Promise<boolean> {
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const serviceSid = this.config.get<string>('TWILIO_SERVICE_SID');
    const client = require('twilio')(accountSid, authToken);

    return new Promise<boolean>((resolve, reject) => {
      client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code: codeToCheck })
        .then(
          (verification_check) => {
            console.log(verification_check);
            return resolve(verification_check.status === 'approved');
          },
          (e) => {
            console.log(e);
            return reject(new ForbiddenException('2fa verification failed'));
          },
        );
    });
  }

  async initSetup(userId: string, dto: MfaSetupDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === true) throw new ForbiddenException('mfa already enabled');

    const success = await this.mfaSendSms(dto.phoneNumber);
    if (success) {
      console.log('mfa initSetup ok');
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaPhoneNumber: dto.phoneNumber,
        },
      });
      return true;
    } else {
      console.log('mfa initSetup failed');
      throw new ForbiddenException("Could't send 2fa sms");
    }
  }

  async finishSetup(userId: string, dto: MfaValidateDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === true) throw new ForbiddenException('mfa already enabled');
    if (user.mfaPhoneNumber === null) throw new ForbiddenException('no phone number');

    const success = await this.mfaCheckCode(user.mfaPhoneNumber, dto.codeToCheck);

    if (success) {
      console.log('mfa finishSetup ok');
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: true,
        },
      });
    } else {
      console.log('mfa finishSetup failed');
      throw new ForbiddenException('2fa verification failed');
    }
  }

  async initSignIn(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === false) throw new ForbiddenException('mfa not enabled');
    if (user.mfaPhoneNumber === null) throw new ForbiddenException('no phone number');

    const success = await this.mfaSendSms(user.mfaPhoneNumber);
    if (success) {
      console.log('mfa initSignIn ok');
    } else {
      console.log('mfa initSignIn failed');
      throw new ForbiddenException("Could't send 2fa sms");
    }
  }

  async validateSignIn(userId: string, dto: MfaValidateDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user === null) throw new ForbiddenException('no such user');
    if (user.mfaEnabled === false) throw new ForbiddenException('mfa not enabled');
    if (user.mfaPhoneNumber === null) throw new ForbiddenException('no phone number');

    const success = await this.mfaCheckCode(user.mfaPhoneNumber, dto.codeToCheck);
    if (success) {
      console.log('mfa validateSignIn ok');
      return await this.authService.signTokens(userId, false);
    } else {
      console.log('mfa validateSignIn failed');
      throw new ForbiddenException('2fa verification failed');
    }
  }

  async disable(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaPhoneNumber: null,
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
