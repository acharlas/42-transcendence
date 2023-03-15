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
exports.FriendService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FriendService = class FriendService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addFriend(userId, dto) {
        console.log('add friend', dto.userId);
        return new Promise((resolve, reject) => {
            if (userId === dto.userId) {
                return reject(new common_1.HttpException({
                    status: common_1.HttpStatus.FORBIDDEN,
                    error: "can't add yourself",
                    code: '301',
                }, common_1.HttpStatus.FORBIDDEN));
            }
            this.prisma.user
                .findFirst({
                where: {
                    id: dto.userId,
                },
            })
                .then((ret) => {
                if (ret === null) {
                    return reject(new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Must add an existing user',
                        code: '302',
                    }, common_1.HttpStatus.FORBIDDEN));
                }
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.user
                        .findFirst({
                        where: {
                            id: userId,
                            myfriend: {
                                some: {
                                    id: dto.userId,
                                },
                            },
                        },
                    })
                        .then((res) => {
                        if (res !== null) {
                            return reject(new common_1.HttpException({
                                status: common_1.HttpStatus.FORBIDDEN,
                                error: 'already friend',
                                code: '303',
                            }, common_1.HttpStatus.FORBIDDEN));
                        }
                        return resolve(new Promise((resolve, reject) => {
                            this.prisma.user
                                .update({
                                where: {
                                    id: userId,
                                },
                                data: {
                                    myfriend: {
                                        connect: {
                                            id: dto.userId,
                                        },
                                    },
                                },
                                select: {
                                    myfriend: true,
                                },
                            })
                                .then((response) => {
                                return resolve(response);
                            })
                                .catch((err) => {
                                return reject(err);
                            });
                        }));
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async removeFriend(userId, dto) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findFirst({
                where: {
                    id: userId,
                    myfriend: {
                        some: { id: dto.userId },
                    },
                },
            })
                .then((ret) => {
                if (ret === null) {
                    return reject(new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'no matching friend',
                        code: '304',
                    }, common_1.HttpStatus.FORBIDDEN));
                }
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.user
                        .update({
                        where: {
                            id: userId,
                        },
                        data: {
                            myfriend: {
                                disconnect: {
                                    id: dto.userId,
                                },
                            },
                        },
                        select: {
                            myfriend: true,
                        },
                    })
                        .then((res) => {
                        return resolve(res);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getFriend(userId, id) {
        console.log('getFriend');
        return new Promise((resolve, reject) => {
            if (userId !== id) {
                return reject(new common_1.HttpException({
                    status: common_1.HttpStatus.FORBIDDEN,
                    error: "can't access friend from a other user",
                    code: '301',
                }, common_1.HttpStatus.FORBIDDEN));
            }
            this.prisma.user
                .findFirst({
                where: {
                    id: id,
                },
                select: {
                    myfriend: true,
                },
            })
                .then((ret) => {
                return resolve(ret);
            });
        });
    }
    async getFriendList(userId) {
        return new Promise((resolve, reject) => {
            this.getFriend(userId, userId)
                .then((ret) => {
                return resolve(ret.myfriend.map((friend) => {
                    return {
                        username: friend.username,
                        nickname: friend.nickname,
                        id: friend.id,
                    };
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
};
FriendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendService);
exports.FriendService = FriendService;
//# sourceMappingURL=friend.service.js.map