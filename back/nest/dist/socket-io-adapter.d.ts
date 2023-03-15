import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';
export declare class SokcetIOAdapter extends IoAdapter {
    private app;
    private configService;
    private prisma;
    constructor(app: INestApplicationContext, configService: ConfigService, prisma: PrismaService);
    createIOServer(port: number, options?: ServerOptions): Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
}
