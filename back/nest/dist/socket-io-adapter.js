"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SokcetIOAdapter = void 0;
const jwt_1 = require("@nestjs/jwt");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SokcetIOAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app, configService, prisma) {
        super(app);
        this.app = app;
        this.configService = configService;
        this.prisma = prisma;
    }
    createIOServer(port, options) {
        const cors = {
            origin: [
                `http://5.182.18.157:3001`,
                new RegExp(`/^http:\/\/5\.182\.18\.([1-9]|[1-9]\d):3001$/`),
            ],
        };
        console.log('config cors with:', { cors });
        const optionsWithCORS = Object.assign(Object.assign({}, options), { cors });
        const jwtService = this.app.get(jwt_1.JwtService);
        const server = super.createIOServer(port, optionsWithCORS);
        server.of('chat').use(createTokenMiddleware(jwtService, this.configService.get('JWT_SECRET'), async (payload) => {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub,
                },
            });
            delete user.hash;
            return user;
        }));
        server.of('game').use(createTokenGameMiddleware(jwtService, this.configService.get('JWT_SECRET'), async (payload) => {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub,
                },
            });
            delete user.hash;
            return user;
        }));
        return server;
    }
}
exports.SokcetIOAdapter = SokcetIOAdapter;
const createTokenMiddleware = (JwtService, secret, validate) => (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];
    console.log(`middleware: validating auth token before connection: ${token}`);
    try {
        console.log({ token }, 'secret: ', secret);
        const payload = JwtService.verify(token, { secret });
        console.log({ payload });
        validate({ sub: payload.sub })
            .then((ret) => {
            console.log('user', { ret });
            socket.userID = ret.id;
            socket.username = ret.username;
            next();
        })
            .catch((err) => {
            return err;
        });
    }
    catch (e) {
        console.log(e);
        next(new Error('FORBIDDEN'));
    }
};
const createTokenGameMiddleware = (JwtService, secret, validate) => (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];
    console.log(`middleware Game: validating auth token before connection: ${token}`);
    try {
        console.log({ token }, 'secret Game: ', secret);
        const payload = JwtService.verify(token, { secret });
        console.log({ payload });
        validate({ sub: payload.sub })
            .then((ret) => {
            console.log('user', { ret });
            socket.userID = ret.id;
            socket.username = ret.username;
            next();
        })
            .catch((err) => {
            return err;
        });
    }
    catch (e) {
        console.log(e);
        next(new Error('FORBIDDEN'));
    }
};
//# sourceMappingURL=socket-io-adapter.js.map