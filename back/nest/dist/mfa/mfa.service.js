"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
let MfaService = class MfaService {
    constructor(config, prisma, jwt, authService) {
        this.config = config;
        this.prisma = prisma;
        this.jwt = jwt;
        this.authService = authService;
    }
    async mfaSendSms(phoneNumber) {
        const accountSid = this.config.get('TWILIO_ACCOUNT_SID');
        const authToken = this.config.get('TWILIO_AUTH_TOKEN');
        const serviceSid = this.config.get('TWILIO_SERVICE_SID');
        const client = require('twilio')(accountSid, authToken);
        return new Promise((resolve, reject) => {
            client.verify.v2
                .services(serviceSid)
                .verifications.create({ to: phoneNumber, channel: 'sms' })
                .then((verification) => {
                return resolve(true);
            }, (e) => {
                return reject(new common_1.ForbiddenException('2fa request failed'));
            });
        });
    }
    async mfaCheckCode(phoneNumber, codeToCheck) {
        const accountSid = this.config.get('TWILIO_ACCOUNT_SID');
        const authToken = this.config.get('TWILIO_AUTH_TOKEN');
        const serviceSid = this.config.get('TWILIO_SERVICE_SID');
        const client = require('twilio')(accountSid, authToken);
        return new Promise((resolve, reject) => {
            client.verify.v2
                .services(serviceSid)
                .verificationChecks.create({ to: phoneNumber, code: codeToCheck })
                .then((verification_check) => {
                return resolve(verification_check.status === 'approved');
            }, (e) => {
                return reject(new common_1.ForbiddenException('2fa verification failed'));
            });
        });
    }
    async initSetup(userId, dto) {
        const user = await this.prisma.user.findFirst({ where: { id: userId } });
        if (user === null)
            throw new common_1.ForbiddenException('no such user');
        if (user.mfaEnabled === true)
            throw new common_1.ForbiddenException('mfa already enabled');
        const success = await this.mfaSendSms(dto.phoneNumber);
        if (success) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaPhoneNumber: dto.phoneNumber,
                },
            });
            return true;
        }
        else {
            throw new common_1.ForbiddenException("Could't send 2fa sms");
        }
    }
    async finishSetup(userId, dto) {
        const user = await this.prisma.user.findFirst({ where: { id: userId } });
        if (user === null)
            throw new common_1.ForbiddenException('no such user');
        if (user.mfaEnabled === true)
            throw new common_1.ForbiddenException('mfa already enabled');
        if (user.mfaPhoneNumber === null)
            throw new common_1.ForbiddenException('no phone number');
        const success = await this.mfaCheckCode(user.mfaPhoneNumber, dto.codeToCheck);
        if (success) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaEnabled: true,
                },
            });
        }
        else {
            throw new common_1.ForbiddenException('2fa verification failed');
        }
    }
    async initSignIn(userId) {
        const user = await this.prisma.user.findFirst({ where: { id: userId } });
        if (user === null)
            throw new common_1.ForbiddenException('no such user');
        if (user.mfaEnabled === false)
            throw new common_1.ForbiddenException('mfa not enabled');
        if (user.mfaPhoneNumber === null)
            throw new common_1.ForbiddenException('no phone number');
        const success = await this.mfaSendSms(user.mfaPhoneNumber);
        if (success) {
        }
        else {
            throw new common_1.ForbiddenException("Could't send 2fa sms");
        }
    }
    async validateSignIn(userId, dto) {
        const user = await this.prisma.user.findFirst({ where: { id: userId } });
        if (user === null)
            throw new common_1.ForbiddenException('no such user');
        if (user.mfaEnabled === false)
            throw new common_1.ForbiddenException('mfa not enabled');
        if (user.mfaPhoneNumber === null)
            throw new common_1.ForbiddenException('no phone number');
        const success = await this.mfaCheckCode(user.mfaPhoneNumber, dto.codeToCheck);
        if (success) {
            return await this.authService.signTokens(userId, false);
        }
        else {
            throw new common_1.ForbiddenException('2fa verification failed');
        }
    }
    async disable(userId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                mfaEnabled: false,
                mfaPhoneNumber: null,
            },
        });
        return user;
    }
};
MfaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        auth_service_1.AuthService])
], MfaService);
exports.MfaService = MfaService;
//# sourceMappingURL=mfa.service.js.map