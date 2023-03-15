import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSigninDto, AuthSigninWithApiDto, AuthSignupDto, getApiToken } from './dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    hashData(data: string): Promise<string>;
    updateRefreshToken(userId: string, newRefreshToken: string): Promise<void>;
    signTokens(userId: string, mfaNeeded: boolean): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getFortyTwoMe(Token: string): Promise<AuthSigninWithApiDto>;
    getApiToken(dto: getApiToken): Promise<string>;
    signup(dto: AuthSignupDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    signin(dto: AuthSigninDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    signWithApi(user: AuthSigninWithApiDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<void>;
}
