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
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const client_1 = require("@prisma/client");
const socket_io_1 = require("socket.io");
const block_service_1 = require("../block/block.service");
const dto_1 = require("../channel/dto");
const friend_service_1 = require("../friend/friend.service");
const game_gateway_1 = require("../game/game.gateway");
const game_service_1 = require("../game/game.service");
const game_utils_1 = require("../game/game.utils");
const socket_service_1 = require("../socket/socket.service");
const user_service_1 = require("../user/user.service");
const channel_service_1 = require("../channel/channel.service");
let MessageGateway = class MessageGateway {
    constructor(channelService, friendService, blockService, userService, gameGateWay, gameService, socketService) {
        this.channelService = channelService;
        this.friendService = friendService;
        this.blockService = blockService;
        this.userService = userService;
        this.gameGateWay = gameGateWay;
        this.gameService = gameService;
        this.socketService = socketService;
        this.SocketList = [];
    }
    afterInit(client) {
    }
    handleConnection(client) {
        const socket = this.io.sockets;
        const find = this.socketService.chatSockets.find((socket) => {
            if (socket.userId === client.userID)
                return true;
            return false;
        });
        if (find) {
            if (find.socket.id !== client.id) {
                find.socket.emit('Disconnect');
                this.socketService.chatSockets = this.socketService.chatSockets.filter((socket) => {
                    if (socket.socket.id === find.socket.id)
                        return false;
                    return true;
                });
                find.socket.disconnect();
            }
        }
        this.socketService.chatSockets.push({ userId: client.userID, socket: client });
        this.io.emit('OnlineList', this.socketService.chatSockets.map(function (a) {
            return a.userId;
        }));
        this.channelService
            .getUserRoom(client.userID)
            .then((res) => {
            client.emit('Rooms', res);
            res.forEach((room) => {
                client.join(room.channel.id);
            });
        })
            .catch((err) => {
        });
        this.friendService
            .getFriendList(client.userID)
            .then((friendList) => {
            client.emit('FriendList', friendList);
        })
            .catch((err) => {
        });
        this.blockService
            .getBlockList(client.userID)
            .then((bloquedList) => {
            client.emit('BloquedList', bloquedList);
        })
            .catch((err) => {
        });
    }
    handleDisconnect(client) {
        const socket = this.io.sockets;
        this.socketService.chatSockets = this.socketService.chatSockets.filter((sock) => {
            if (sock.userId === client.userID)
                return false;
            return true;
        });
        this.io.emit('OnlineList', this.socketService.chatSockets.map(function (a) {
            return a.userId;
        }));
    }
    handshake(client) {
        client.emit('new_user', client.id);
        return;
    }
    CreateRoom(roomDto, client) {
        return new Promise((resolve, reject) => {
            this.channelService
                .createChannel(client.userID, roomDto)
                .then((ret) => {
                client.join(ret.channel.id);
                client.emit('NewRoom', { room: ret });
                return resolve();
            })
                .catch((err) => {
                client.emit('ErrMessage', { code: 'err31' });
                return reject(err);
            });
        });
    }
    sendRoomMessage(roomId, message, client) {
        return new Promise((resolve, reject) => {
            this.channelService
                .addChannelMessage(client.userID, roomId, client.username, message)
                .then((ret) => {
                client.broadcast.to(roomId).emit('RoomMessage', { roomId: roomId, message: ret });
                client.emit('RoomMessage', { roomId: roomId, message: ret });
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    joinRoom(name, password, client) {
        return new Promise((resolve, reject) => {
            this.channelService
                .JoinChannelByName(name, client.userID, { password: password })
                .then((ret) => {
                client.join(ret.channel.id);
                client.emit('NewRoom', { room: ret, itch: true });
                client.broadcast.to(ret.channel.id).emit('JoinRoom', {
                    id: ret.channel.id,
                    user: ret.user.find((user) => {
                        if (user.username === client.username)
                            return true;
                        return false;
                    }),
                });
                return resolve();
            })
                .catch((err) => {
                if (err.message)
                    client.emit('ErrMessage', { code: err.message });
                return reject(err);
            });
        });
    }
    LeaveRoom(roomId, client) {
        return new Promise((resolve, reject) => {
            this.channelService
                .leaveChannel(client.userID, roomId)
                .then((ret) => {
                client.emit('RemoveRoom', ret.channelId);
                client.broadcast.to(roomId).emit('RemoveUser', {
                    username: ret.user.username,
                    roomId: ret.channelId,
                });
                client.leave(roomId);
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    UpdateUserPrivilege(roomId, privilege, time, toModifie, client) {
        return new Promise((resolve, reject) => {
            this.channelService
                .channelUserUpdate(client.userID, toModifie, roomId, privilege, time)
                .then((ret) => {
                return resolve(new Promise((resolve, reject) => {
                    this.channelService
                        .getChannelUser(roomId)
                        .then((user) => {
                        client.to(roomId).emit('UpdateUserList', { roomId: roomId, user: user });
                        client.emit('UpdateUserList', { roomId: roomId, user: user });
                        if (privilege === client_1.UserPrivilege.ban) {
                            const sock = this.socketService.chatSockets.find((sock) => {
                                if (sock.socket.username === toModifie)
                                    return true;
                                return false;
                            });
                            sock.socket.emit('RemoveRoom', roomId);
                            sock.socket.leave(roomId);
                        }
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                    return resolve();
                }).catch((err) => {
                    return reject(err);
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    BanUser(user, time, client) {
        return new Promise((resolve, reject) => {
            return resolve();
        });
    }
    addFriend(friend, client) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUser(friend)
                .then((user) => {
                if (!user) {
                    client.emit('ErrMessage', { code: 'err12' });
                    return;
                }
                return resolve(new Promise((resolve, reject) => {
                    this.friendService
                        .addFriend(client.userID, { userId: user.id })
                        .then((ret) => {
                        return resolve(new Promise((resolve, reject) => {
                            this.friendService
                                .getFriendList(client.userID)
                                .then((friendList) => {
                                client.emit('FriendList', friendList);
                                return resolve();
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
                client.emit('ErrMessage', { code: 'err11' });
                return reject(err);
            });
        });
    }
    addBlock(Block, client) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUser(Block)
                .then((user) => {
                if (!user) {
                    client.emit('ErrMessage', { code: 'err22' });
                    return;
                }
                return resolve(new Promise((resolve, reject) => {
                    this.blockService
                        .addBlock(client.userID, { userId: user.id })
                        .then((ret) => {
                        return resolve(new Promise((resolve, reject) => {
                            this.blockService
                                .getBlockList(client.userID)
                                .then((bloquedList) => {
                                client.emit('BloquedList', bloquedList);
                                return resolve();
                            })
                                .catch((err) => {
                                return reject();
                            });
                        }));
                    })
                        .catch((err) => {
                        client.emit('ErrMessage', { code: 'err21' });
                        return reject(err);
                    });
                }));
            })
                .catch((err) => {
                return reject();
            });
        });
    }
    RemoveFriend(remove, client) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUser(remove)
                .then((user) => {
                return resolve(new Promise((resolve, reject) => {
                    this.friendService
                        .removeFriend(client.userID, { userId: user.id })
                        .then((ret) => {
                        return resolve(new Promise((resolve, reject) => {
                            this.friendService
                                .getFriendList(client.userID)
                                .then((friendList) => {
                                client.emit('FriendList', friendList);
                                return resolve();
                            })
                                .catch((err) => {
                                return reject(err);
                            });
                        }));
                    })
                        .catch((err) => {
                        return reject();
                    });
                }));
            })
                .then((err) => {
                return reject();
            });
        });
    }
    RemoveBlock(remove, client) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUser(remove)
                .then((user) => {
                return resolve(new Promise((resolve, reject) => {
                    this.blockService
                        .removeBlock(client.userID, { userId: user.id })
                        .then((ret) => {
                        return resolve(new Promise((resolve, reject) => {
                            this.blockService
                                .getBlockList(client.userID)
                                .then((bloquedList) => {
                                client.emit('BloquedList', bloquedList);
                                return resolve();
                            })
                                .catch((err) => {
                                return reject(err);
                            });
                        }));
                    })
                        .catch((err) => {
                        return reject();
                    });
                }));
            })
                .then((err) => {
                return reject();
            });
        });
    }
    UpdateRoom(roomId, dto, client) {
        return new Promise((resolve, reject) => {
            this.channelService
                .editChannel(client.userID, roomId, dto)
                .then((channel) => {
                return resolve(new Promise((resolve, reject) => {
                    const updateChan = {
                        id: channel.id,
                        name: channel.name,
                        type: channel.type,
                    };
                    client.broadcast.emit('UpdateRoom', updateChan);
                    client.emit('UpdateRoom', updateChan);
                    return resolve();
                }));
            })
                .catch((err) => {
                client.emit('ErrMessage', { code: err.message });
                return reject(err);
            });
        });
    }
    Dm(sendTo, client) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUser(sendTo)
                .then((to) => {
                this.channelService
                    .CreateDm(client.userID, to.id)
                    .then((room) => {
                    client.emit('NewRoom', { room, itch: true });
                    client.join(room.channel.id);
                    const sock = this.socketService.chatSockets.find((sock) => {
                        if (sock.userId === to.id)
                            return true;
                        return false;
                    });
                    sock.socket.join(room.channel.id);
                    sock.socket.emit('NewRoom', { room, itch: false });
                    return resolve();
                })
                    .catch((err) => {
                    return reject;
                });
            })
                .catch((err) => {
                return reject();
            });
        });
    }
    InviteUser(user, channel, client) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUser(user)
                .then((userAdd) => {
                this.channelService
                    .InviteUser(client.userID, userAdd.id, channel)
                    .then((room) => {
                    return resolve();
                })
                    .catch((err) => {
                    return reject(err);
                });
            })
                .catch((err) => {
                return reject;
            });
        });
    }
    InviteUserInGame(inviteId, client) {
        const addPlayerToRoom = (lobby, user) => {
            const gameSocket = this.socketService.gameSockets.find((socket) => {
                if (socket.userId === client.userID)
                    return true;
                return false;
            });
            if (gameSocket) {
                gameSocket.socket.join(lobby.id);
                gameSocket.socket.emit('JoinLobby', lobby);
            }
            else
                client.emit('JoinGame');
            const inviteSocket = this.socketService.chatSockets.find((socket) => {
                if (socket.userId === inviteId)
                    return true;
                return false;
            });
            if (inviteSocket)
                inviteSocket.socket.emit('GameInvite', {
                    id: user.id,
                    nickname: user.nickname,
                });
            return;
        };
        return new Promise((resolve, reject) => {
            this.userService
                .getUserUsername(client.userID)
                .then((user) => {
                return resolve(new Promise((resolve, reject) => {
                    this.gameService
                        .FindPLayerLobby(client.userID)
                        .then((lobby) => {
                        if (!lobby || (0, game_utils_1.PlayerIsInWatching)(client.userID, lobby)) {
                            return resolve(new Promise((resolve, reject) => {
                                this.gameService
                                    .CreateLobby(client.userID)
                                    .then((lobby) => {
                                    return resolve(addPlayerToRoom(lobby, user));
                                })
                                    .catch((err) => {
                                    return reject(err);
                                });
                            }));
                        }
                        else {
                            return resolve(addPlayerToRoom(lobby, user));
                        }
                    })
                        .catch((err) => {
                        return reject;
                    });
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    AccepteGameInvite(userid, client) {
        return new Promise((resolve, reject) => {
            const lobby = this.gameService.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userid, lobby);
            });
            if (!lobby)
                return reject();
            this.gameService
                .JoinLobby(client.userID, lobby.id)
                .then((lobby) => {
                const gameSocket = this.socketService.gameSockets.find((socket) => {
                    if (socket.userId === client.userID)
                        return true;
                    return false;
                });
                if (gameSocket) {
                    gameSocket.socket.emit('JoinLobby', lobby);
                    gameSocket.socket.join(lobby.id);
                }
                else
                    client.emit('JoinGame');
                const gameHostSocket = this.socketService.gameSockets.find((socket) => {
                    if (socket.userId === userid)
                        return true;
                    return false;
                });
                if (gameHostSocket)
                    gameHostSocket.socket.emit('JoinLobby', lobby);
            })
                .catch((err) => {
                return reject();
            });
            return resolve();
        });
    }
    WatchPartie(userId, client) {
        return new Promise((resolve, reject) => {
            const lobby = this.gameService.LobbyList.find((lobby) => {
                return (0, game_utils_1.PlayerIsInLobby)(userId, lobby);
            });
            if (!lobby)
                return reject('No lobby to spectate');
            this.gameService
                .JoinViewer(client.userID, lobby.id)
                .then((lobby) => {
                const gameSocket = this.socketService.gameSockets.find((socket) => {
                    if (socket.userId === client.userID)
                        return true;
                    return false;
                });
                if (gameSocket) {
                    gameSocket.socket.join(lobby.id);
                    gameSocket.socket.emit('JoinSpectate', lobby);
                }
                else
                    client.emit('JoinGame');
            })
                .catch((err) => {
                return reject();
            });
            return resolve();
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], MessageGateway.prototype, "io", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('handshake'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handshake", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('CreateRoom'),
    __param(0, (0, websockets_1.MessageBody)('CreateChannelDto')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateChannelDto, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "CreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('SendRoomMessage'),
    __param(0, (0, websockets_1.MessageBody)('roomId')),
    __param(1, (0, websockets_1.MessageBody)('message')),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "sendRoomMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('JoinRoom'),
    __param(0, (0, websockets_1.MessageBody)('name')),
    __param(1, (0, websockets_1.MessageBody)('password')),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('LeaveRoom'),
    __param(0, (0, websockets_1.MessageBody)('roomId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "LeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UpdateUserPrivilege'),
    __param(0, (0, websockets_1.MessageBody)('roomId')),
    __param(1, (0, websockets_1.MessageBody)('privilege')),
    __param(2, (0, websockets_1.MessageBody)('time')),
    __param(3, (0, websockets_1.MessageBody)('toModifie')),
    __param(4, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date, String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "UpdateUserPrivilege", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UpdateUserPrivilege'),
    __param(0, (0, websockets_1.MessageBody)('user')),
    __param(1, (0, websockets_1.MessageBody)('Date')),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "BanUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('AddFriend'),
    __param(0, (0, websockets_1.MessageBody)('newFriend')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "addFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('AddBlock'),
    __param(0, (0, websockets_1.MessageBody)('newBlock')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "addBlock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('RemoveFriend'),
    __param(0, (0, websockets_1.MessageBody)('nickname')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "RemoveFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('RemoveBlock'),
    __param(0, (0, websockets_1.MessageBody)('nickname')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "RemoveBlock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UpdateRoom'),
    __param(0, (0, websockets_1.MessageBody)('roomId')),
    __param(1, (0, websockets_1.MessageBody)('updateChannelDto')),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.EditChannelDto, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "UpdateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('Dm'),
    __param(0, (0, websockets_1.MessageBody)('sendTo')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "Dm", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('InviteUser'),
    __param(0, (0, websockets_1.MessageBody)('user')),
    __param(1, (0, websockets_1.MessageBody)('channel')),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "InviteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('InviteUserInGame'),
    __param(0, (0, websockets_1.MessageBody)('inviteId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "InviteUserInGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('AccepteGameInvite'),
    __param(0, (0, websockets_1.MessageBody)('userid')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "AccepteGameInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('WatchPartie'),
    __param(0, (0, websockets_1.MessageBody)('userId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "WatchPartie", null);
MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        friend_service_1.FriendService,
        block_service_1.BlockService,
        user_service_1.UserService,
        game_gateway_1.GameGateway,
        game_service_1.GameService,
        socket_service_1.SocketService])
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=message.gateway.js.map