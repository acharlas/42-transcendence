import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { SocketWithAuth } from './message/types';

export class SokcetIOAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get(`CLIENT_PORT`));
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

    server.of('chat').use(createTokenMiddleware(jwtService));

    return server;
  }
}

const createTokenMiddleware =
  (JwtService: JwtService) => (socket: SocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    console.log(`validating auth token before connection: ${token}`);

    try {
      const payload = JwtService.verify(token);
      socket.userID = payload.sub;
      socket.pollID = payload.pollID;
      socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
