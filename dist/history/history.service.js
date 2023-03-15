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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HistoryService = class HistoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createhistory(createHistoryDto) {
        new Promise((resolve, reject) => {
            console.log("createhistory service");
            this.prisma.history
                .create({
                data: {
                    mode: createHistoryDto.mode,
                },
            })
                .then((history) => {
                createHistoryDto.score.forEach((elem) => {
                    this.prisma.userHistory
                        .create({
                        data: {
                            placement: elem.placement,
                            yourScore: elem.score,
                            user: {
                                connect: {
                                    id: elem.id,
                                },
                            },
                            history: {
                                connect: {
                                    id: history.id,
                                },
                            },
                        },
                    })
                        .then(() => {
                        this.prisma.history
                            .update({
                            where: {
                                id: history.id,
                            },
                            data: {
                                user: {
                                    connect: {
                                        userId_historyId: {
                                            userId: elem.id,
                                            historyId: history.id,
                                        },
                                    },
                                },
                            },
                        })
                            .catch((err) => {
                            return reject(err);
                        });
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                });
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getHistoryId(historyId) {
        const playerHistory = await this.prisma.history.findUnique({
            where: {
                id: historyId,
            },
            include: {
                user: true,
            },
        });
        return playerHistory;
    }
    async getUserHistory(userId) {
        return new Promise((resolve, reject) => {
            this.prisma.userHistory
                .findMany({
                where: {
                    userId: userId,
                },
                select: {
                    history: {
                        select: {
                            createdAt: true,
                            mode: true,
                            user: { include: { user: true } },
                        },
                    },
                },
            })
                .then((history) => {
                if (!history) {
                    return resolve(null);
                }
                const hist = history.map((history) => {
                    return {
                        date: history.history.createdAt,
                        gameMode: history.history.mode,
                        player: history.history.user.map((user) => {
                            return {
                                id: user.userId,
                                userName: user.user.username,
                                score: user.yourScore,
                                placement: user.placement,
                            };
                        }),
                    };
                });
                return resolve(hist);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async editElo(userId, newMmr) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                mmr: newMmr,
            },
        });
    }
    async incrementWins(userId) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                wins: { increment: 1 },
            },
        });
    }
    async incrementLosses(userId) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                losses: { increment: 1 },
            },
        });
    }
    async getElo(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        return user.mmr;
    }
    async updateRankings(gameData) {
        console.log("updateRanking");
        console.log(gameData);
        this.incrementWins(gameData.winnerId);
        this.incrementLosses(gameData.loserId);
        var EloRank = require('elo-rank');
        var elo = new EloRank(24);
        var winnerMmr = await this.getElo(gameData.winnerId);
        var loserMmr = await this.getElo(gameData.loserId);
        console.log("old MMR:", winnerMmr, loserMmr);
        const winnerExpectedScore = elo.getExpected(winnerMmr, loserMmr);
        const loserExpectedScore = elo.getExpected(loserMmr, winnerMmr);
        winnerMmr = elo.updateRating(winnerExpectedScore, 1, winnerMmr);
        loserMmr = elo.updateRating(loserExpectedScore, 0, loserMmr);
        console.log("new MMR:", winnerMmr, loserMmr);
        this.editElo(gameData.winnerId, await winnerMmr);
        this.editElo(gameData.loserId, await loserMmr);
    }
};
HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HistoryService);
exports.HistoryService = HistoryService;
//# sourceMappingURL=history.service.js.map