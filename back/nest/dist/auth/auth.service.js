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
exports.AuthService = void 0;
const axios_1 = require("axios");
const argon = require("argon2");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    hashData(data) {
        return argon.hash(data);
    }
    async updateRefreshToken(userId, newRefreshToken) {
        const hashedRefreshToken = await this.hashData(newRefreshToken);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: hashedRefreshToken,
            },
        });
    }
    async signTokens(userId, mfaNeeded) {
        const payload = {
            sub: userId,
            fullyAuth: !mfaNeeded,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '2h',
                secret: this.config.get('JWT_SECRET'),
            }),
            this.jwt.signAsync(payload, {
                expiresIn: '2d',
                secret: this.config.get('JWT_SECRET'),
            }),
        ]);
        await this.updateRefreshToken(userId, refreshToken);
        return { access_token: accessToken, refresh_token: refreshToken };
    }
    async getFortyTwoMe(Token) {
        return new Promise((resolve, reject) => {
            (0, axios_1.default)({
                method: 'get',
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                url: 'https://api.intra.42.fr/v2/me',
            })
                .then((ret) => {
                return resolve(ret.data);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getApiToken(dto) {
        const payload = {
            grant_type: 'authorization_code',
            client_id: this.config.get('42API_UID'),
            client_secret: this.config.get('42API_SECRET'),
            code: dto.code,
            redirect_uri: this.config.get('42API_REDIRECT'),
            state: dto.state,
        };
        return new Promise((resolve, reject) => {
            console.log({ payload });
            (0, axios_1.default)({
                method: 'post',
                url: 'https://api.intra.42.fr/oauth/token',
                data: payload,
                headers: {
                    'content-type': 'application/json',
                },
            })
                .then((ret) => {
                return resolve(ret.data.access_token);
            })
                .catch((err) => {
                console.log('axios error:', err);
                return reject(new common_1.ForbiddenException('Failed authenticating with oauth'));
            });
        });
    }
    async signup(dto) {
        const hash = await this.hashData(dto.password);
        let nickname = dto.username;
        if (!dto.nickname && dto.nickname !== '' && dto.nickname !== undefined) {
            nickname = dto.nickname;
        }
        return new Promise((resolve, reject) => {
            this.prisma.user
                .create({
                data: {
                    username: dto.username,
                    hash,
                    nickname,
                    userType: 'normal',
                    fortyTwoId: -1,
                },
            })
                .then((ret) => {
                this.signTokens(ret.id, false)
                    .then((ret) => {
                    return resolve(ret);
                })
                    .catch((err) => {
                    console.log('signup: signToken error', err);
                    return reject(new common_1.UnauthorizedException('signup failed'));
                });
            })
                .catch((err) => {
                console.log('signup: prisma.user.create error', err);
                return reject(new common_1.UnauthorizedException('username taken'));
            });
        });
    }
    async signin(dto) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findUnique({
                where: {
                    username: dto.username,
                },
            })
                .then((ret) => {
                if (!ret) {
                    return reject(new common_1.ForbiddenException('wrong username'));
                }
                return resolve(new Promise((resolve, reject) => {
                    argon.verify(ret.hash, dto.password).then((res) => {
                        if (!res) {
                            return reject(new common_1.ForbiddenException('wrong password'));
                        }
                        return resolve(this.signTokens(ret.id, ret.mfaEnabled));
                    });
                }));
            })
                .catch((err) => {
                console.log(err);
                return reject(new common_1.ForbiddenException('wrong password'));
            });
        });
    }
    async signWithApi(user) {
        const found = await this.prisma.user.findFirst({
            where: {
                userType: 'fortyTwo',
                fortyTwoId: user.id,
            },
        });
        return new Promise((resolve, reject) => {
            if (found !== null) {
                this.signTokens(found.id, found.mfaEnabled)
                    .then((ret) => {
                    return resolve(ret);
                })
                    .catch((err) => {
                    console.log(err);
                    return reject(new common_1.ForbiddenException('Failed authenticating with oauth'));
                });
            }
            else {
                this.prisma.user
                    .create({
                    data: {
                        username: user.login,
                        hash: '',
                        nickname: user.login,
                        userType: 'fortyTwo',
                        fortyTwoId: user.id,
                    },
                })
                    .then((ret) => {
                    return resolve(this.signTokens(ret.id, ret.mfaEnabled));
                })
                    .catch((err) => {
                    console.log(err);
                    return reject(new common_1.ForbiddenException('Failed to signup with oauth.'));
                });
            }
        });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('no user');
        if (!user.refreshToken)
            throw new common_1.ForbiddenException('no refresher stored');
        try {
            const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
            if (!refreshTokenMatches)
                throw new common_1.ForbiddenException('refresh token does not match');
        }
        catch (e) {
            throw new common_1.ForbiddenException("refresh token didn't verify");
        }
        const tokens = await this.signTokens(user.id, false);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: null,
            },
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map