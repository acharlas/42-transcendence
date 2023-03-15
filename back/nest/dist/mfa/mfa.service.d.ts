import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaValidateDto } from './dto/mfa-validate.dto';
import { AuthService } from 'src/auth/auth.service';
export declare class MfaService {
    private config;
    private prisma;
    private jwt;
    private authService;
    constructor(config: ConfigService, prisma: PrismaService, jwt: JwtService, authService: AuthService);
    mfaSendSms(phoneNumber: string): Promise<boolean>;
    mfaCheckCode(phoneNumber: string, codeToCheck: string): Promise<boolean>;
    initSetup(userId: string, dto: MfaSetupDto): Promise<boolean>;
    finishSetup(userId: string, dto: MfaValidateDto): Promise<void>;
    initSignIn(userId: string): Promise<void>;
    validateSignIn(userId: string, dto: MfaValidateDto): Promise<{
        access_token: string;
    }>;
    disable(userId: string): Promise<import(".prisma/client").User>;
}
