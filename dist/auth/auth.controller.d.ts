import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthSigninDto, AuthSignupDto, getApiToken } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthSignupDto): Promise<{
        access_token: string;
    }>;
    signin(dto: AuthSigninDto): Promise<{
        access_token: string;
    }>;
    signinApi(dto: getApiToken): Promise<{
        access_token: string;
    }>;
    refreshTokens(req: Request): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<any>;
}
