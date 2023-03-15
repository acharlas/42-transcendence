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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const socket_service_1 = require("../socket/socket.service");
const user_service_1 = require("../user/user.service");
const const_1 = require("./const");
const game_utils_1 = require("./game.utils");
let GameService = class GameService {
    constructor(schedulerRegistry, userService, socketService) {
        this.schedulerRegistry = schedulerRegistry;
        this.userService = userService;
        this.socketService = socketService;
        this.LobbyList = [];
        this.Queue = [];
        this.Speed = 0.0000666666;
        this.ingameList = [];
    }
    async JoiningQueue(userId, gameMode) {
        return new Promise((resolve, reject) => {
            console.log('actual queue: ', this.Queue);
            this.CreatePlayer(userId)
                .then((newPlayer) => {
                const find = this.Queue.find((player) => {
                    if (player.player.id === newPlayer.id)
                        return true;
                    return false;
                });
                if (!find)
                    this.Queue.push({ player: newPlayer, mode: gameMode });
                if (find)
                    this.LeavingQueue(userId).catch((err) => {
                        return reject(err);
                    });
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async LeavingQueue(userId) {
        return new Promise((resolve, reject) => {
            this.Queue = this.Queue.filter((player) => {
                if (player.player.id === userId)
                    return false;
                return true;
            });
            return resolve();
        });
    }
    async CreateLobby(userId) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUserId(userId, userId)
                .then((user) => {
                return resolve(new Promise((resolve, reject) => {
                    const lobby = {
                        id: userId,
                        playerOne: { id: userId, mmr: user.mmr, nickname: user.nickname, readdy: true },
                        playerTwo: null,
                        game: null,
                        mode: client_1.GameMode.CLASSIC,
                        invited: [],
                        viewer: [],
                    };
                    this.LeaveLobby(userId)
                        .then(() => {
                        const find = this.LobbyList.find((lobbyL) => {
                            if (lobbyL.id === lobby.id)
                                return true;
                            return false;
                        });
                        if (find)
                            return reject(new common_1.ForbiddenException('lobby already create'));
                        this.LobbyList.push(lobby);
                        return resolve(lobby);
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
    async AddInvite(lobbyId, inviteId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                if (lobby.id === lobbyId)
                    return true;
                return false;
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException('no such lobby'));
            if (lobby.invited.find((user) => {
                if (user === inviteId)
                    return true;
                return false;
            }))
                return reject(new common_1.ForbiddenException('user already invite'));
            lobby.invited.push(inviteId);
            return resolve(lobby);
        });
    }
    async LeaveLobby(userId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (lobby) {
                if (lobby.playerOne.id === userId) {
                    if (lobby.playerTwo === null) {
                        this.LobbyList = this.LobbyList.filter((lobby) => {
                            if (lobby.playerOne.id === userId)
                                return false;
                            return true;
                        });
                        return resolve(lobby);
                    }
                    else {
                        lobby.playerOne = Object.assign(Object.assign({}, lobby.playerTwo), { readdy: true });
                        lobby.playerTwo = null;
                        return resolve(lobby);
                    }
                }
                else {
                    lobby.playerTwo = null;
                    return resolve(lobby);
                }
            }
            const lobbyViewer = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInWatching)(userId, lobby);
            });
            if (lobbyViewer) {
                lobbyViewer.viewer = lobbyViewer.viewer.filter((user) => {
                    if (user === userId)
                        return false;
                    return true;
                });
                if (lobby.game)
                    this.schedulerRegistry.deleteInterval(lobby.id);
                return resolve(lobbyViewer);
            }
            return resolve(null);
        });
    }
    async CreatePlayer(userId) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUserId(userId, userId)
                .then((user) => {
                return resolve({ id: userId, mmr: user.mmr, nickname: user.nickname, readdy: false });
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async JoinLobby(userId, lobbyId) {
        return new Promise((resolve, reject) => {
            const actLobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (actLobby) {
                if (actLobby.game)
                    return reject(new common_1.ForbiddenException('already in a game'));
                else {
                    this.LeaveLobby(userId)
                        .then((lobby) => {
                        const joinLobby = this.LobbyList.find((lobby) => {
                            if (lobby.id === lobbyId)
                                return true;
                            return false;
                        });
                        if (!joinLobby)
                            return reject(new common_1.ForbiddenException('no such lobby'));
                        if (joinLobby.playerTwo)
                            return reject(new common_1.ForbiddenException('lobby is full'));
                        return resolve(new Promise((resolve, reject) => {
                            this.CreatePlayer(userId)
                                .then((player) => {
                                joinLobby.playerTwo = player;
                                joinLobby.invited = joinLobby.invited.filter((user) => {
                                    if (user === userId)
                                        return false;
                                    return true;
                                });
                                return resolve(joinLobby);
                            })
                                .catch((err) => {
                                return reject(err);
                            });
                        }));
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }
            }
            const joinLobby = this.LobbyList.find((lobby) => {
                if (lobby.id === lobbyId)
                    return true;
                return false;
            });
            if (!joinLobby)
                return reject(new common_1.ForbiddenException('no such lobby'));
            if (joinLobby.playerTwo)
                return reject(new common_1.ForbiddenException('lobby is full'));
            return resolve(new Promise((resolve, reject) => {
                this.CreatePlayer(userId)
                    .then((player) => {
                    joinLobby.playerTwo = player;
                    joinLobby.invited = joinLobby.invited.filter((user) => {
                        if (user === userId)
                            return false;
                        return true;
                    });
                    return resolve(joinLobby);
                })
                    .catch((err) => {
                    return reject(err);
                });
            }));
        });
    }
    async PlayerDisconnect(userId) {
        return new Promise((resolve, reject) => {
            const inQueue = this.Queue.find((player) => {
                return player.player.id === userId;
            });
            if (inQueue)
                this.LeavingQueue(userId);
            const oldLobby = Object.assign({}, this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            }));
            this.LeaveLobby(userId)
                .then((lobby) => {
                if (lobby) {
                    return resolve(oldLobby);
                }
                return resolve(null);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async FindPLayerLobby(userId) {
        return new Promise((resolve, reject) => {
            return resolve(this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby) || (0, game_utils_1.PlayerIsInWatching)(userId, lobby);
            }));
        });
    }
    async JoinViewer(userId, lobbyId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                if (lobby.id === lobbyId)
                    return true;
                return false;
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException('no such lobby'));
            if (lobby.viewer.find((viewer) => {
                if (viewer === userId)
                    return true;
                return false;
            }))
                return reject(new common_1.ForbiddenException('already in the lobby'));
            if (this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            }))
                return resolve(new Promise((resolve, reject) => {
                    this.LeaveLobby(userId)
                        .then(() => {
                        lobby.viewer.push(userId);
                        return resolve(lobby);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            lobby.viewer.push(userId);
            return resolve(lobby);
        });
    }
    async PlayerLobbyReaddy(userId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException('no lobby found'));
            if (lobby.playerOne.id === userId)
                return reject(new common_1.ForbiddenException('player is player one'));
            lobby.playerTwo.readdy = !lobby.playerTwo.readdy;
            return resolve(lobby);
        });
    }
    async ChangeLobbyMode(userId, mode) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (lobby) {
                lobby.mode = mode;
                return resolve(lobby);
            }
            else
                return reject(new common_1.ForbiddenException('no lobby'));
        });
    }
    async incIngameList(newLobby) {
        this.ingameList.push(newLobby.playerOne.id);
        this.ingameList.push(newLobby.playerTwo.id);
        const sock1 = this.socketService.chatSockets.find((socket) => {
            return socket.userId === newLobby.playerOne.id;
        });
        const sock2 = this.socketService.chatSockets.find((socket) => {
            return socket.userId === newLobby.playerTwo.id;
        });
        if (sock1) {
            sock1.socket.broadcast.emit('IngameList', this.ingameList);
            sock1.socket.emit('IngameList', this.ingameList);
        }
        else if (sock2) {
            sock2.socket.broadcast.emit('IngameList', this.ingameList);
            sock2.socket.emit('IngameList', this.ingameList);
        }
    }
    async decIngameList(idOne, idTwo) {
        this.ingameList = this.ingameList.filter(function (element, index, array) {
            return element !== idOne && element !== idTwo;
        });
        const sock1 = this.socketService.chatSockets.find((socket) => {
            return socket.userId === idOne;
        });
        const sock2 = this.socketService.chatSockets.find((socket) => {
            return socket.userId === idTwo;
        });
        if (sock1) {
            sock1.socket.broadcast.emit('IngameList', this.ingameList);
            sock1.socket.emit('IngameList', this.ingameList);
        }
        else if (sock2) {
            sock2.socket.broadcast.emit('IngameList', this.ingameList);
            sock2.socket.emit('IngameList', this.ingameList);
        }
    }
    async MatchPlayer() {
        let n = 0;
        const newLobby = [];
        return new Promise((resolve, reject) => {
            while (n < this.Queue.length) {
                const playerOne = this.Queue[n];
                const playerTwo = this.Queue.find((playerTwo) => {
                    if (playerOne.player.id !== playerTwo.player.id && playerOne.mode === playerTwo.mode)
                        return true;
                    return false;
                });
                if (playerTwo) {
                    const lobby = {
                        id: playerOne.player.id + playerTwo.player.id,
                        playerOne: Object.assign(Object.assign({}, playerOne.player), { readdy: true }),
                        playerTwo: Object.assign(Object.assign({}, playerTwo.player), { readdy: true }),
                        game: null,
                        mode: playerOne.mode,
                        invited: [],
                        viewer: [],
                    };
                    this.LobbyList = [...this.LobbyList, lobby];
                    this.Queue = this.Queue.filter((player) => {
                        if (player.player.id !== playerOne.player.id && player.player.id !== playerTwo.player.id)
                            return true;
                        return false;
                    });
                    newLobby.push(lobby);
                }
                else
                    n++;
            }
            return resolve(newLobby);
        });
    }
    async UpdatePlayerPos(userId, position) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException("user isn't in a lobby"));
            lobby.game.player[(0, game_utils_1.WitchPlayer)(userId, lobby)].position.y = position;
            return resolve(lobby);
        });
    }
    async CreateGame(userId, gameMode) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException("user isn't in a lobby"));
            if (!lobby.playerOne || !lobby.playerTwo)
                return reject(new common_1.ForbiddenException('missing player'));
            if (!(0, game_utils_1.LobbyIsReaddy)(lobby))
                return reject(new common_1.ForbiddenException('lobby is not readdy'));
            lobby.game = {
                start: false,
                player: [
                    { id: lobby.playerOne.id, ready: false, pauseAt: null, timer: 60000, position: { x: 0, y: 0.5 } },
                    { id: lobby.playerTwo.id, ready: false, pauseAt: null, timer: 60000, position: { x: 0, y: 0.5 } },
                ],
                paddleHeight: 0,
                paddleWidth: 0,
                ballRadius: 0,
                score: [0, 0],
                ball: { position: { x: 0.5, y: 0.5 }, vector: (0, game_utils_1.RandSpeed)(this.Speed) },
                ballMomentum: gameMode === client_1.GameMode.HYPERSPEED ? const_1.ballMomentumStart : 1,
            };
            this.incIngameList(lobby);
            return resolve(lobby);
        });
    }
    async SetGameStart(lobbyId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                if (lobby.id === lobbyId)
                    return true;
                return false;
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException("lobby doesn't exist"));
            lobby.game = Object.assign(Object.assign({}, lobby.game), { start: true });
            return resolve(lobby);
        });
    }
    async PlayerReady(userId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            lobby.game.player[(0, game_utils_1.WitchPlayer)(userId, lobby)].ready = true;
            return resolve(lobby);
        });
    }
    async UpdatePlayer(userId, paddleHeight, paddleWidth, ballRadius, position) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            lobby.game.paddleHeight = paddleHeight;
            lobby.game.paddleWidth = paddleWidth;
            lobby.game.ballRadius = ballRadius;
            lobby.game.player[(0, game_utils_1.WitchPlayer)(userId, lobby)].position.x = position;
            lobby.game.player[(0, game_utils_1.WitchPlayer)(userId, lobby)].ready = true;
            return resolve(lobby);
        });
    }
    async EndGame(userId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            lobby.game = null;
            return resolve(lobby);
        });
    }
    async UpdateBall(lobbyId) {
        return new Promise((resolve, reject) => {
            const lobby = this.LobbyList.find((lobby) => {
                return lobby.id === lobbyId;
            });
            if (!lobby)
                return reject(new common_1.ForbiddenException('no lobby'));
            let nextPos;
            console.log(lobby.game.ball);
            nextPos = {
                x: lobby.game.ball.position.x + lobby.game.ball.vector.x * const_1.BallSpeed,
                y: lobby.game.ball.position.y + lobby.game.ball.vector.y * const_1.BallSpeed,
            };
            nextPos = (0, game_utils_1.NormPos)(nextPos);
            const bounce = (0, game_utils_1.BallOnPaddle)(lobby, nextPos);
            if (bounce >= 0) {
                lobby.game.ball.vector.x = lobby.game.ball.vector.x * -1 * lobby.game.ballMomentum;
                if (bounce === 1)
                    lobby.game.ball.position.x =
                        lobby.game.player[1].position.x - lobby.game.paddleWidth / 2 - lobby.game.ballRadius / 2;
                else
                    lobby.game.ball.position.x =
                        lobby.game.player[0].position.x + lobby.game.paddleWidth / 2 + lobby.game.ballRadius / 2;
                lobby.game.ball.position.y = nextPos.y;
            }
            else if ((0, game_utils_1.BallScore)(lobby, nextPos)) {
                lobby.game.ball.vector.x = (0, game_utils_1.RandSpeed)(this.Speed).x * -1;
                lobby.game.ball.position = { x: 0.5, y: 0.5 };
            }
            else if ((0, game_utils_1.ballHitWall)(lobby, nextPos)) {
                if (lobby.mode === client_1.GameMode.HYPERSPEED) {
                    lobby.game.ball.position.y =
                        nextPos.y + lobby.game.ballRadius / 2 >= 1
                            ? 0 + lobby.game.ballRadius / 2 + 0.00001
                            : 1 - lobby.game.ballRadius / 2 - 0.00001;
                    lobby.game.ball.position.x = nextPos.x;
                }
                else
                    lobby.game.ball.vector.y = lobby.game.ball.vector.y * -1;
            }
            else {
                lobby.game.ball.position = Object.assign({}, nextPos);
            }
            return resolve(lobby);
        });
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        user_service_1.UserService,
        socket_service_1.SocketService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map