import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private moduleRef;
    constructor(config: ConfigService, prisma: PrismaService, moduleRef: ModuleRef);
    validate(request: Request, payload: {
        sub: string;
        fullyAuth: boolean;
    }): Promise<import(".prisma/client").User>;
}
export {};
