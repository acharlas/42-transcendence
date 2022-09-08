import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { SocketWithAuth } from './message/types';
import { PrismaService } from './prisma/prisma.service';

export class SokcetIOAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: [
        `http://localhost:3001`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):3001$/`),
      ],
    };

    console.log('config cors with:', { cors });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('chat').use(
      createTokenMiddleware(
        jwtService,
        this.configService.get('JWT_SECRET'),
        async (payload: { sub: string }) => {
          const user = await this.prisma.user.findUnique({
            where: {
              id: payload.sub,
            },
          });
          delete user.hash;
          return user;
        },
      ),
    );

    return server;
  }
}

const createTokenMiddleware =
  (JwtService: JwtService, secret: string, validate: Function) =>
  (socket: SocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    console.log(
      `middleware: validating auth token before connection: ${token}`,
    );

    try {
      console.log({ token }, 'secret: ', secret);
      const payload = JwtService.verify(token, { secret });
      console.log({ payload });
      const user = validate({ sub: payload.sub });
      socket.userID = user.id;
      socket.name = user.username;
      next();
    } catch (e) {
      console.log(e);
      next(new Error('FORBIDDEN'));
    }
  };
