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
exports.BlockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlockService = class BlockService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addBlock(userId, dto) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findFirst({
                where: {
                    id: dto.userId,
                },
            })
                .then((ret) => {
                if (userId === dto.userId) {
                    return reject(new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: "can't add yourself",
                        code: '201',
                    }, common_1.HttpStatus.FORBIDDEN));
                }
                if (ret === null) {
                    return reject(new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'Must add an existing user',
                        code: '202',
                    }, common_1.HttpStatus.FORBIDDEN));
                }
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.user
                        .findFirst({
                        where: {
                            id: userId,
                            myblock: {
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
                                error: 'already block',
                                code: '203',
                            }, common_1.HttpStatus.FORBIDDEN));
                        }
                        return resolve(new Promise((resolve, reject) => {
                            this.prisma.user
                                .update({
                                where: {
                                    id: userId,
                                },
                                data: {
                                    myblock: {
                                        connect: {
                                            id: dto.userId,
                                        },
                                    },
                                },
                                select: {
                                    myblock: true,
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
            });
        });
    }
    async removeBlock(userId, dto) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findFirst({
                where: {
                    id: userId,
                    myblock: {
                        some: { id: dto.userId },
                    },
                },
            })
                .then((ret) => {
                if (ret === null) {
                    return reject(new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'no matching block',
                        code: '204',
                    }, common_1.HttpStatus.FORBIDDEN));
                }
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.user
                        .update({
                        where: {
                            id: userId,
                        },
                        data: {
                            myblock: {
                                disconnect: {
                                    id: dto.userId,
                                },
                            },
                        },
                        select: {
                            myblock: true,
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
    async getBlock(userId, id) {
        return new Promise((resolve, reject) => {
            if (userId != id) {
                return reject(new common_1.HttpException({
                    status: common_1.HttpStatus.FORBIDDEN,
                    error: "can't access block from a other user",
                    code: '201',
                }, common_1.HttpStatus.FORBIDDEN));
            }
            const block = this.prisma.user
                .findFirst({
                where: {
                    id: id,
                },
                select: {
                    myblock: true,
                },
            })
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getBlockList(userId) {
        return new Promise((resolve, reject) => {
            this.getBlock(userId, userId)
                .then((ret) => {
                return resolve(ret.myblock.map((block) => {
                    return {
                        username: block.username,
                        nickname: block.nickname,
                    };
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
};
BlockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlockService);
exports.BlockService = BlockService;
//# sourceMappingURL=block.service.js.map