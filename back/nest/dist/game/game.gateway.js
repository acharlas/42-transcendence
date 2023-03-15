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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const schedule_1 = require("@nestjs/schedule");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const create_history_dto_1 = require("../history/dto/create-history.dto");
const history_service_1 = require("../history/history.service");
const game_service_1 = require("./game.service");
const game_utils_1 = require("./game.utils");
const client_1 = require("@prisma/client");
const user_service_1 = require("../user/user.service");
const socket_service_1 = require("../socket/socket.service");
const const_1 = require("./const");
let GameGateway = class GameGateway {
    constructor(gameService, historyService, scheduleRegistry, userService, socketService) {
        this.gameService = gameService;
        this.historyService = historyService;
        this.scheduleRegistry = scheduleRegistry;
        this.userService = userService;
        this.socketService = socketService;
    }
    afterInit(client) {
        console.log(`client in game after init: ${client.id}`);
    }
    handleConnection(client) {
        const socket = this.io.sockets;
        console.log('socket list in game: ', this.socketService.gameSockets);
        const find = this.socketService.gameSockets.find((socket) => {
            if (socket.userId === client.userID)
                return true;
            return false;
        });
        if (find) {
            console.log('find to game:', find);
            if (find.socket.id !== client.id) {
                find.socket.emit('Disconnect');
                this.socketService.gameSockets = this.socketService.gameSockets.filter((socket) => {
                    if (socket.socket.id === find.socket.id)
                        return false;
                    return true;
                });
                find.socket.disconnect();
            }
        }
        this.socketService.gameSockets.push({ userId: client.userID, socket: client });
        const lobby = this.gameService.LobbyList.find((lobby) => {
            return (0, game_utils_1.PlayerIsInLobby)(client.userID, lobby);
        });
        console.log('lobby find: ', lobby);
        if (lobby) {
            client.join(lobby.id);
            client.emit('JoinLobby', lobby);
        }
        this.socketService.gameSockets.push({ userId: client.userID, socket: client });
        const lobbyWatch = this.gameService.LobbyList.find((lobby) => {
            if (lobby.viewer.find((viewer) => {
                if (viewer === client.userID)
                    return true;
                return false;
            }))
                return true;
            return false;
        });
        console.log('lobby watch find: ', lobbyWatch);
        if (lobbyWatch) {
            client.join(lobbyWatch.id);
            client.emit('JoinSpectate', lobbyWatch);
        }
        console.log(`Client connected to game: ${client.id} | userid: ${client.userID} | name: ${client.username}`);
        console.log(`Number of sockets connected to game: ${socket.size}`);
    }
    handleDisconnect(client) {
        const socket = this.io.sockets;
        this.socketService.gameSockets = this.socketService.gameSockets.filter((sock) => {
            if (sock.userId === client.userID)
                return false;
            return true;
        });
        console.log(`Client disconnected of game: ${client.id} | name: ${client.username}`);
        console.log(`Number of sockets connected to game: ${socket.size}`);
        this.gameService
            .PlayerDisconnect(client.userID)
            .then((lobby) => {
            console.log('lobby found');
            if (lobby) {
                const player1 = {
                    id: lobby.game.player[1].id,
                    score: lobby.game.score[0],
                    placement: lobby.game.player[1].id === client.userID ? 2 : 1,
                };
                const player2 = {
                    id: lobby.game.player[0].id,
                    score: lobby.game.score[1],
                    placement: lobby.game.player[0].id === client.userID ? 2 : 1,
                };
                const history = {
                    mode: lobby.mode,
                    score: [player1, player2],
                };
                if (lobby.game && lobby.game.start) {
                    this.scheduleRegistry.deleteInterval(lobby.id);
                    this.gameService.decIngameList(player1.id, player2.id);
                    if (lobby.mode === client_1.GameMode.RANKED) {
                        if (player1.placement === 1) {
                            this.historyService.updateRankings({ winnerId: player1.id, loserId: player2.id });
                        }
                        else {
                            this.historyService.updateRankings({ winnerId: player2.id, loserId: player1.id });
                        }
                        client.broadcast.to(lobby.id).emit('EndGame', {
                            history: {
                                mode: lobby.mode,
                                score: [
                                    Object.assign(Object.assign({}, player1), { nickName: lobby.playerTwo.nickname }),
                                    Object.assign(Object.assign({}, player2), { nickName: lobby.playerOne.nickname }),
                                ],
                            },
                            lobby: null,
                        });
                    }
                    else {
                        client.broadcast.to(lobby.id).emit('EndGame', {
                            history: {
                                mode: lobby.mode,
                                score: [
                                    Object.assign(Object.assign({}, player1), { nickName: lobby.playerTwo.nickname }),
                                    Object.assign(Object.assign({}, player2), { nickName: lobby.playerOne.nickname }),
                                ],
                            },
                            lobby: null,
                        });
                    }
                }
                client.to(lobby.id).emit('PlayerLeave', client.userID);
                client.leave(lobby.id);
                this.historyService.createhistory(history).then(() => {
                    this.gameService
                        .EndGame(lobby.game.player[0].id === client.userID ? lobby.game.player[1].id : lobby.game.player[0].id)
                        .then(() => {
                        return;
                    })
                        .catch((err) => {
                        console.log(err);
                        return;
                    });
                });
            }
        })
            .catch((err) => {
            console.log(err);
            return;
        });
    }
    sync() {
        this.gameService
            .MatchPlayer()
            .then((newLobby) => {
            newLobby.forEach((lobby) => {
                const socketPlayerOne = this.socketService.gameSockets.find((socket) => {
                    if (socket.userId === lobby.playerOne.id)
                        return true;
                    return false;
                });
                const socketPlayerTwo = this.socketService.gameSockets.find((socket) => {
                    if (socket.userId === lobby.playerTwo.id)
                        return true;
                    return false;
                });
                socketPlayerOne.socket.join(lobby.id);
                socketPlayerTwo.socket.join(lobby.id);
                socketPlayerOne.socket.emit('GameCreate', lobby);
                socketPlayerTwo.socket.emit('GameCreate', lobby);
                this.CreateGame(socketPlayerOne.socket, lobby.mode);
                socketPlayerOne.socket.emit('QueueJoin');
                socketPlayerTwo.socket.emit('QueueJoin');
            });
        })
            .catch((err) => {
            console.log(err);
        });
    }
    handshake(client) {
        console.log('sending back user id....');
        client.emit('handshake', client.id);
        return;
    }
    JoiningQueue(client, mode) {
        console.log('User:', client.userID, ' joining the queue');
        return new Promise((resolve, reject) => {
            this.gameService
                .JoiningQueue(client.userID, mode)
                .then(() => {
                client.emit('QueueJoin');
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    LeavingQueue(client) {
        console.log('User:', client.userID, ' Leaving the queue');
        return new Promise((resolve, reject) => {
            this.gameService
                .LeavingQueue(client.userID)
                .then(() => {
                client.emit('LeaveQueue');
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
            return resolve();
        });
    }
    CreateLobby(client) {
        console.log('User:', client.userID, 'create lobby');
        return new Promise((resolve, reject) => {
            this.gameService
                .CreateLobby(client.userID)
                .then((lobby) => {
                client.join(lobby.id);
                client.emit('JoinLobby', lobby);
                client.to(lobby.id).emit('UserJoinLobby', client.userID);
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    LeavingLobby(client) {
        console.log('User:', client.userID, ' Leaving lobby');
        return new Promise((resolve, reject) => {
            this.gameService
                .LeaveLobby(client.userID)
                .then((lobby) => {
                if (lobby) {
                    client.broadcast.to(lobby.id).emit('UpdateLobby', lobby);
                }
                client.emit('LeaveLobby');
                client.leave(lobby.id);
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    ChangeLobbyMode(client, mode) {
        console.log('User:', client.userID, 'is readdy');
        return new Promise((resolve, reject) => {
            this.gameService
                .ChangeLobbyMode(client.userID, mode)
                .then((lobby) => {
                console.log('end');
                client.emit('UpdateLobby', lobby);
                client.to(lobby.id).emit('UpdateLobby', lobby);
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    PlayerLobbbyReaddy(client) {
        console.log('User:', client.userID, 'is readdy');
        return new Promise((resolve, reject) => {
            this.gameService
                .PlayerLobbyReaddy(client.userID)
                .then((lobby) => {
                console.log('end');
                client.emit('UpdateLobby', lobby);
                client.to(lobby.id).emit('UpdateLobby', lobby);
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    NewHistory(client, history) {
        console.log('Received newHistory message:', history);
        this.historyService.updateRankings({
            winnerId: 'c7a689d2-e9db-4469-9607-2a4dc47e311e',
            loserId: 'ee5f9533-0de0-44fe-ac05-8e774d6af6bc',
        });
        return new Promise((resolve, reject) => {
            this.historyService
                .createhistory(history)
                .then(() => {
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    UpdatePlayerPosition(client, position) {
        return new Promise((resolve, reject) => {
            this.gameService
                .UpdatePlayerPos(client.userID, position)
                .then((lobby) => {
                if (lobby)
                    client.broadcast.to(lobby.id).emit('NewPlayerPos', {
                        player: lobby.playerTwo.id === client.userID,
                        y: position,
                    });
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    CreateGame(client, mode) {
        return new Promise((resolve, reject) => {
            this.gameService
                .CreateGame(client.userID, mode)
                .then((lobby) => {
                const callback = () => {
                    this.gameService
                        .FindPLayerLobby(client.userID)
                        .then((lobby) => {
                        if (!lobby.game.start && (0, game_utils_1.PlayerIsReaddy)(lobby)) {
                            this.gameService
                                .SetGameStart(lobby.id)
                                .then((lobby) => {
                                client.emit('StartGame', lobby);
                                client.broadcast.to(lobby.id).emit('StartGame', lobby);
                                return resolve();
                            })
                                .catch((err) => {
                                console.log(err);
                                return resolve();
                            });
                        }
                        else if (lobby.game.start) {
                            this.gameService
                                .UpdateBall(lobby.id)
                                .then((lobby) => {
                                if (lobby.game.score[0] < const_1.EndPoint && lobby.game.score[1] < const_1.EndPoint) {
                                    client.broadcast.to(lobby.id).emit('NewBallPos', lobby.game.ball.position);
                                    client.emit('NewBallPos', lobby.game.ball.position);
                                }
                                else {
                                    this.scheduleRegistry.deleteInterval(lobby.id);
                                    this.gameService.decIngameList(lobby.game.player[0].id, lobby.game.player[1].id);
                                    const player1 = {
                                        id: lobby.game.player[1].id,
                                        score: lobby.game.score[0],
                                        placement: lobby.game.score[0] > lobby.game.score[1] ? 1 : 2,
                                    };
                                    const player2 = {
                                        id: lobby.game.player[0].id,
                                        score: lobby.game.score[1],
                                        placement: lobby.game.score[1] > lobby.game.score[0] ? 1 : 2,
                                    };
                                    if (lobby.mode === client_1.GameMode.RANKED) {
                                        if (player1.placement === 1) {
                                            this.historyService.updateRankings({ winnerId: player1.id, loserId: player2.id });
                                        }
                                        else {
                                            this.historyService.updateRankings({ winnerId: player2.id, loserId: player1.id });
                                        }
                                        this.userService.AchievementUpdate([Object.assign({}, lobby.game.player[0]), Object.assign({}, lobby.game.player[1])], [lobby.game.score[0], lobby.game.score[1]]);
                                    }
                                    const history = {
                                        mode: lobby.mode,
                                        score: [player1, player2],
                                    };
                                    if (lobby.mode === client_1.GameMode.RANKED) {
                                        client.broadcast.to(lobby.id).emit('EndGame', {
                                            history: {
                                                mode: lobby.mode,
                                                score: [
                                                    Object.assign(Object.assign({}, player1), { nickName: lobby.playerTwo.nickname }),
                                                    Object.assign(Object.assign({}, player2), { nickName: lobby.playerOne.nickname }),
                                                ],
                                            },
                                            lobby: null,
                                        });
                                        client.emit('EndGame', {
                                            history: {
                                                mode: lobby.mode,
                                                score: [
                                                    Object.assign(Object.assign({}, player1), { nickName: lobby.playerTwo.nickname }),
                                                    Object.assign(Object.assign({}, player2), { nickName: lobby.playerOne.nickname }),
                                                ],
                                            },
                                            lobby: null,
                                        });
                                    }
                                    else {
                                        client.broadcast.to(lobby.id).emit('EndGame', {
                                            history: {
                                                mode: lobby.mode,
                                                score: [
                                                    Object.assign(Object.assign({}, player1), { nickName: lobby.playerTwo.nickname }),
                                                    Object.assign(Object.assign({}, player2), { nickName: lobby.playerOne.nickname }),
                                                ],
                                            },
                                            lobby: Object.assign(Object.assign({}, lobby), { game: null }),
                                        });
                                        client.emit('EndGame', {
                                            history: {
                                                mode: lobby.mode,
                                                score: [
                                                    Object.assign(Object.assign({}, player1), { nickName: lobby.playerTwo.nickname }),
                                                    Object.assign(Object.assign({}, player2), { nickName: lobby.playerOne.nickname }),
                                                ],
                                            },
                                            lobby: Object.assign(Object.assign({}, lobby), { game: null }),
                                        });
                                    }
                                    this.historyService
                                        .createhistory(history)
                                        .then(() => {
                                        this.gameService
                                            .EndGame(lobby.playerOne.id)
                                            .then(() => {
                                            this.gameService
                                                .LeaveLobby(lobby.playerOne.id)
                                                .then((lobby) => {
                                                this.gameService.LeaveLobby(lobby.playerTwo.id).catch((err) => {
                                                    console.log(err);
                                                    return reject(err);
                                                });
                                            })
                                                .catch((err) => {
                                                console.log(err);
                                                return reject(err);
                                            });
                                            return resolve();
                                        })
                                            .catch((err) => {
                                            console.log(err);
                                            return reject();
                                        });
                                    })
                                        .catch((err) => {
                                        console.log(err);
                                        return reject();
                                    });
                                }
                                client.broadcast.to(lobby.id).emit('updateScore', lobby.game.score);
                                client.emit('updateScore', lobby.game.score);
                            })
                                .catch((err) => {
                                console.log(err);
                                return resolve();
                            });
                        }
                        return resolve();
                    })
                        .catch((err) => {
                        this.scheduleRegistry.deleteInterval(lobby.id);
                        console.log(err);
                        return;
                    });
                };
                const interval = setInterval(callback, 15);
                this.scheduleRegistry.addInterval(lobby.id, interval);
                client.broadcast.to(lobby.id).emit('GameCreate', lobby);
                client.emit('GameCreate', lobby);
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    UpdateBallPosition(client, position) {
        return new Promise((resolve, reject) => {
            this.gameService
                .FindPLayerLobby(client.userID)
                .then((lobby) => {
                if (lobby)
                    client.broadcast.to(lobby.id).emit('NewBallPos', position);
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    StartGame(client) {
        return new Promise((resolve, reject) => {
            this.gameService
                .FindPLayerLobby(client.userID)
                .then((lobby) => {
                client.broadcast.to(lobby.id).emit('StartGame');
                client.emit('StartGame');
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    PlayerReady(client) {
        return new Promise((resolve, reject) => {
            console.log('PlayerReady');
            this.gameService
                .PlayerReady(client.userID)
                .then((lobby) => {
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
    UpdatePlayer(client, paddleHeight, paddleWitdh, ballRadius, position) {
        return new Promise((resolve, reject) => {
            console.log('PlayerReady', position);
            this.gameService
                .UpdatePlayer(client.userID, paddleHeight, paddleWitdh, ballRadius, position)
                .then((lobby) => {
                return resolve();
            })
                .catch((err) => {
                console.log(err);
                return reject();
            });
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], GameGateway.prototype, "io", void 0);
__decorate([
    (0, schedule_1.Cron)('*/1 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "sync", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('handshake'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handshake", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('JoiningQueue'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "JoiningQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('LeavingQueue'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "LeavingQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('CreateLobby'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "CreateLobby", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('LeavingLobby'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "LeavingLobby", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ChangeLobbyMode'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "ChangeLobbyMode", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('PlayerLobbyReaddy'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "PlayerLobbbyReaddy", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('NewHistory'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('newHistory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_history_dto_1.CreateHistoryDto]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "NewHistory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UpdatePlayerPosition'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('pos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "UpdatePlayerPosition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('CreateGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "CreateGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UpdateBallPosition'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('pos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "UpdateBallPosition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('StartGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "StartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('PlayerReady'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "PlayerReady", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UpdatePlayer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('paddleHeight')),
    __param(2, (0, websockets_1.MessageBody)('paddleWitdh')),
    __param(3, (0, websockets_1.MessageBody)('ballRadius')),
    __param(4, (0, websockets_1.MessageBody)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "UpdatePlayer", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'game',
    }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        history_service_1.HistoryService,
        schedule_1.SchedulerRegistry,
        user_service_1.UserService,
        socket_service_1.SocketService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map