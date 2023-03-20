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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const const_1 = require("../game/const");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserId(userId, id) {
        const user = await this.prisma.user.findFirst({ where: { id: id } });
        if (user === null)
            throw new common_1.ForbiddenException('no such user');
        return user;
    }
    async getUsers() {
        const user = this.prisma.user.findMany();
        return user;
    }
    async getUserUsername(id) {
        const user = await this.prisma.user.findFirst({ where: { id: id } });
        if (user === null)
            throw new common_1.ForbiddenException('no such user');
        return user;
    }
    async editUser(userId, dto) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .update({
                where: {
                    id: userId,
                },
                data: Object.assign({}, dto),
            })
                .then((user) => {
                delete user.mfaEnabled;
                delete user.mfaPhoneNumber;
                delete user.hash;
                delete user.refreshToken;
                return resolve(user);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getHistory(UserId) {
        const playerHistory = await this.prisma.user.findUnique({
            where: {
                id: UserId,
            },
            select: {
                history: true,
            },
        });
        return playerHistory;
    }
    async getUser(nickname) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findUnique({
                where: {
                    nickname: nickname,
                },
            })
                .then((user) => {
                return resolve(user);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async GetAchievement(userId) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findUnique({
                where: {
                    id: userId,
                },
            })
                .then((user) => {
                return resolve(user.achievement);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async AddAchievement(userId, achievement) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findUnique({
                where: {
                    id: userId,
                },
            })
                .then((user) => {
                if (user.achievement.find((ach) => {
                    return ach === achievement;
                }))
                    return reject(new common_1.ForbiddenException('achievement already add'));
                return resolve(new Promise((resolve, reject) => {
                    const newAchievement = user.achievement;
                    newAchievement.push(achievement);
                    this.prisma.user
                        .update({
                        where: { id: user.id },
                        data: {
                            achievement: newAchievement,
                        },
                    })
                        .then(() => {
                        return resolve(newAchievement);
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
    async AchievementUpdate(player, score) {
        return new Promise((resolve, reject) => {
            if ((score[1] === const_1.EndPoint && score[0] === 0) || (score[0] === const_1.EndPoint && score[1] === 0)) {
                this.GetAchievement(player[0].id)
                    .then((achievementPLayerOne) => {
                    this.GetAchievement(player[1].id)
                        .then((achievementPLayerTwo) => {
                        if (score[1] === const_1.EndPoint &&
                            score[0] === 0 &&
                            !achievementPLayerOne.find((ach) => {
                                return ach === client_1.Achievement.EasyWin;
                            }))
                            this.AddAchievement(player[0].id, client_1.Achievement.EasyWin).catch((err) => {
                                return reject(err);
                            });
                        if (score[0] === const_1.EndPoint &&
                            score[1] === 0 &&
                            !achievementPLayerTwo.find((ach) => {
                                return ach === client_1.Achievement.EasyWin;
                            }))
                            this.AddAchievement(player[1].id, client_1.Achievement.EasyWin).catch((err) => {
                                return reject(err);
                            });
                        if (score[1] === const_1.EndPoint &&
                            score[0] === 0 &&
                            !achievementPLayerTwo.find((ach) => {
                                return ach === client_1.Achievement.HardLoss;
                            }))
                            this.AddAchievement(player[1].id, client_1.Achievement.HardLoss).catch((err) => {
                                return reject(err);
                            });
                        if (score[0] === const_1.EndPoint &&
                            score[1] === 0 &&
                            !achievementPLayerTwo.find((ach) => {
                                return ach === client_1.Achievement.HardLoss;
                            }))
                            this.AddAchievement(player[0].id, client_1.Achievement.HardLoss).catch((err) => {
                                return reject(err);
                            });
                        return resolve();
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                })
                    .catch((err) => {
                    return reject(err);
                });
            }
        });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map