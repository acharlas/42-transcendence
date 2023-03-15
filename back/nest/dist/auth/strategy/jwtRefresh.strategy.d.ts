import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private prisma;
    private moduleRef;
    constructor(config: ConfigService, prisma: PrismaService, moduleRef: ModuleRef);
    validate(request: Request, payload: {
        sub: string;
        fullyAuth: boolean;
    }): Promise<{
        refreshToken: string;
        sub: string;
        fullyAuth: boolean;
    }>;
}
export {};
