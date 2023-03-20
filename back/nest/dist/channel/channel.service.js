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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const binary_1 = require("@prisma/client/runtime/binary");
const argon = require("argon2");
const prisma_service_1 = require("../prisma/prisma.service");
let ChannelService = class ChannelService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChannel(userID, dto) {
        return new Promise((resolve, reject) => {
            let hash = null;
            if (dto.type === client_1.ChannelType.protected) {
                if (dto.password === undefined || dto.password === null) {
                    return reject(new common_1.ForbiddenException('Cannot create protected channel without password'));
                }
            }
            argon
                .hash(dto.password)
                .then((res) => {
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.channel
                        .create({
                        data: {
                            name: dto.name,
                            type: dto.type,
                            hash: res,
                            users: {
                                create: [
                                    {
                                        privilege: client_1.UserPrivilege.owner,
                                        status: client_1.UserStatus.connected,
                                        user: {
                                            connect: {
                                                id: userID,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        include: {
                            users: {
                                include: {
                                    user: true,
                                },
                            },
                            messages: {
                                select: {
                                    content: true,
                                    user: true,
                                },
                            },
                        },
                    })
                        .then((resp) => {
                        return resolve({
                            channel: { id: resp.id, name: resp.name, type: resp.type },
                            user: resp.users.map((user) => {
                                return {
                                    username: user.user.username,
                                    nickname: user.user.nickname,
                                    id: user.user.id,
                                    privilege: user.privilege,
                                    status: user.status,
                                };
                            }),
                            message: resp.messages.map((msg) => {
                                return {
                                    content: msg.content,
                                    username: msg.user.username,
                                    nickname: msg.user.nickname,
                                };
                            }),
                        });
                    })
                        .catch((err) => {
                        return reject(new common_1.ForbiddenException('channel already exist'));
                    });
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getChannels(userId) {
        return new Promise((resolve, reject) => {
            this.prisma.channel
                .findMany({
                where: {
                    type: {
                        not: 'private',
                    },
                },
                select: {
                    type: true,
                    name: true,
                    id: true,
                },
            })
                .then((ret) => {
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.channel
                        .findMany({
                        where: {
                            type: 'private',
                            users: {
                                some: {
                                    userId: userId,
                                },
                            },
                        },
                        select: {
                            type: true,
                            name: true,
                            id: true,
                        },
                    })
                        .then((res) => {
                        res.map((elem) => {
                            ret.push(elem);
                        });
                        return resolve(ret);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            })
                .catch((err) => {
                return reject(new common_1.BadRequestException('Cannot find ressource'));
            });
        });
    }
    async getChannelById(channelId) {
        return new Promise((resolve, reject) => {
            this.prisma.channel
                .findUnique({
                where: { id: channelId },
                include: {
                    users: {
                        select: {
                            userId: true,
                            user: {
                                select: {
                                    nickname: true,
                                },
                            },
                        },
                    },
                },
            })
                .then((ret) => {
                delete ret.hash;
                return resolve(ret);
            })
                .catch((err) => {
                return reject(new common_1.ForbiddenException('Access to resource denied'));
            });
        });
    }
    async editChannel(userId, channelId, dto) {
        let hash = null;
        if (dto.type === client_1.ChannelType.protected) {
            if (dto.password === undefined || dto.password === null) {
                throw new common_1.ForbiddenException('err32');
            }
            hash = await argon.hash(dto.password);
        }
        const channel = await this.getChannelById(channelId);
        const getUserPrivilege = await this.prisma.channelUser.findFirst({
            where: {
                channelId,
                userId,
            },
        });
        if (!channel || !getUserPrivilege || getUserPrivilege.privilege !== client_1.UserPrivilege.owner) {
            throw new common_1.ForbiddenException('err33');
        }
        try {
            return await this.prisma.channel.update({
                where: {
                    id: channelId,
                },
                data: {
                    name: dto.name,
                    type: dto.type,
                    hash: hash,
                },
            });
        }
        catch (e) {
            if (e instanceof binary_1.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ForbiddenException('err31');
                }
            }
            throw e;
        }
    }
    async deleteChannelById(userId, channelId) {
        const channel = await this.getChannelById(channelId);
        const getUserPrivilege = await this.prisma.channelUser.findFirst({
            where: {
                channelId,
                userId,
            },
        });
        if (!channel || !getUserPrivilege || getUserPrivilege.privilege !== client_1.UserPrivilege.owner) {
            throw new common_1.ForbiddenException('Access to resources denied');
        }
        return await this.prisma.channel.delete({
            where: {
                id: channelId,
            },
        });
    }
    async joinChannelById(userId, channelId, dto) {
        return new Promise((resolve, reject) => {
            this.prisma.channel
                .findUnique({
                where: {
                    id: channelId,
                },
            })
                .then((channel) => {
                if (!channel) {
                    throw new common_1.ForbiddenException('err41');
                }
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.user
                        .findUnique({ where: { id: userId } })
                        .then((user) => {
                        if (channel.type === client_1.ChannelType.public)
                            return resolve(new Promise((resolve, reject) => {
                                this.joinUpdateChannel(user, channel)
                                    .then((room) => {
                                    return resolve(room);
                                })
                                    .catch((err) => {
                                    return reject(err);
                                });
                            }));
                        else if (channel.type === client_1.ChannelType.protected)
                            return resolve(new Promise((resolve, reject) => {
                                this.joinProtectedChannel(user, channel, dto)
                                    .then((room) => {
                                    return resolve(room);
                                })
                                    .catch((err) => {
                                    return reject(err);
                                });
                            }));
                        else if (channel.type === client_1.ChannelType.private)
                            return resolve(new Promise((resolve, reject) => {
                                this.joinPrivateChannel(user, channel)
                                    .then((room) => {
                                    return resolve(room);
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
                throw new common_1.ForbiddenException('Access to resource denied');
            });
        });
    }
    async joinPrivateChannel(user, channel) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .findUnique({
                where: {
                    userId_channelId: { userId: user.id, channelId: channel.id },
                },
            })
                .then((chanUser) => {
                if (!chanUser || chanUser.status !== client_1.UserStatus.invited)
                    return reject(new common_1.ForbiddenException('err43'));
                return resolve(new Promise((resolve, reject) => {
                    this.joinUpdateChannel(user, channel)
                        .then((room) => {
                        return resolve(room);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            });
        });
    }
    async joinProtectedChannel(user, channel, dto) {
        return new Promise((resolve, reject) => {
            if (dto.password === null || dto.password === undefined || dto.password === '') {
                return reject(new common_1.ForbiddenException('err42'));
            }
            argon.verify(channel.hash, dto.password).then((pwMathes) => {
                if (!pwMathes) {
                    return reject(new common_1.ForbiddenException('err42'));
                }
                return resolve(new Promise((resolve, reject) => {
                    this.joinUpdateChannel(user, channel)
                        .then((room) => {
                        return resolve(room);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            });
        });
    }
    async joinUpdateChannel(user, channel) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .findUnique({
                where: {
                    userId_channelId: { channelId: channel.id, userId: user.id },
                },
            })
                .then((userChan) => {
                if (userChan) {
                    if (userChan.privilege === client_1.UserPrivilege.ban) {
                        const date = new Date();
                        if (date.getTime() < userChan.time.getTime())
                            return reject(new common_1.ForbiddenException('err44'));
                    }
                    if (userChan.status === client_1.UserStatus.connected) {
                        throw new common_1.ForbiddenException('err45');
                    }
                    return resolve(new Promise((resolve, reject) => {
                        this.prisma.channelUser
                            .update({
                            where: {
                                userId_channelId: {
                                    userId: userChan.userId,
                                    channelId: userChan.channelId,
                                },
                            },
                            data: {
                                status: client_1.UserStatus.connected,
                                privilege: client_1.UserPrivilege.default,
                            },
                            include: {
                                channel: {
                                    include: {
                                        users: {
                                            include: {
                                                user: true,
                                            },
                                        },
                                        messages: {
                                            select: {
                                                content: true,
                                                user: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })
                            .then((ret) => {
                            return resolve({
                                channel: {
                                    name: ret.channel.name,
                                    id: ret.channel.id,
                                    type: ret.channel.type,
                                },
                                user: ret.channel.users.map((user) => {
                                    return {
                                        username: user.user.username,
                                        nickname: user.user.nickname,
                                        id: user.user.id,
                                        privilege: user.privilege,
                                        status: user.status,
                                    };
                                }),
                                message: ret.channel.messages.map((msg) => {
                                    return {
                                        content: msg.content,
                                        username: msg.user.username,
                                    };
                                }),
                            });
                        })
                            .catch((err) => {
                            return reject(err);
                        });
                    }));
                }
                else
                    return resolve(new Promise((resolve, reject) => {
                        this.prisma.channel
                            .update({
                            where: {
                                id: channel.id,
                            },
                            data: {
                                users: {
                                    create: [
                                        {
                                            privilege: client_1.UserPrivilege.default,
                                            status: client_1.UserStatus.connected,
                                            user: {
                                                connect: {
                                                    id: user.id,
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                            include: {
                                users: {
                                    include: {
                                        user: true,
                                    },
                                },
                                messages: {
                                    select: {
                                        content: true,
                                        user: true,
                                    },
                                },
                            },
                        })
                            .then((channel) => {
                            return resolve({
                                channel: {
                                    id: channel.id,
                                    name: channel.name,
                                    type: channel.type,
                                },
                                user: channel.users.map((user) => {
                                    return {
                                        username: user.user.username,
                                        nickname: user.user.nickname,
                                        id: user.user.id,
                                        privilege: user.privilege,
                                        status: user.status,
                                    };
                                }),
                                message: channel.messages.map((msg) => {
                                    return {
                                        content: msg.content,
                                        username: msg.user.username,
                                    };
                                }),
                            });
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
    async leaveChannel(userId, channelId) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .update({
                where: {
                    userId_channelId: { channelId: channelId, userId: userId },
                },
                data: {
                    status: client_1.UserStatus.disconnected,
                    privilege: client_1.UserPrivilege.default,
                },
                include: {
                    user: true,
                },
            })
                .then((ret) => {
                this.prisma.channelUser
                    .findMany({
                    where: {
                        status: client_1.UserStatus.connected,
                        channelId: channelId,
                    },
                })
                    .then((ret) => {
                    if (!ret || ret.length === 0) {
                        this.prisma.channel
                            .deleteMany({
                            where: {
                                id: channelId,
                            },
                        })
                            .then((ret) => {
                        })
                            .catch((err) => {
                            return reject(err);
                        });
                    }
                })
                    .catch((err) => {
                    return reject(err);
                });
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getChannelMessage(channelId, userId) {
        return new Promise((resolve, reject) => {
            this.prisma.channel
                .findFirst({
                where: {
                    id: channelId,
                },
                include: {
                    messages: {
                        include: {
                            user: {
                                select: {},
                            },
                        },
                    },
                },
            })
                .then((ret) => {
                return resolve(ret.messages.map((elem) => {
                    return {
                        content: elem.content,
                        username: elem.username,
                    };
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async addChannelMessage(userId, channelId, username, content) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .findUnique({
                where: {
                    userId_channelId: { channelId: channelId, userId: userId },
                },
                include: {
                    user: true,
                },
            })
                .then((res) => {
                if (res.privilege === client_1.UserPrivilege.muted) {
                    const date = new Date();
                    if (date.getTime() < res.time.getTime())
                        return reject(new common_1.ForbiddenException('you are muted'));
                }
                return resolve(new Promise((resolve, reject) => {
                    if (res.privilege === 'muted' || res.privilege === 'ban')
                        return reject(new common_1.ForbiddenException("this user can't post message"));
                    this.prisma.message
                        .create({
                        data: {
                            content: content,
                            username: username,
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                            channel: {
                                connect: {
                                    id: channelId,
                                },
                            },
                        },
                    })
                        .then((ret) => {
                        return resolve({
                            content: ret.content,
                            username: ret.username,
                        });
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                }));
            })
                .catch((err) => {
                return reject(new common_1.ForbiddenException("user isn't on channel"));
            });
        });
    }
    async channelUserUpdate(userId, toModified, channelId, priv, time) {
        return new Promise((resolve, reject) => {
            this.prisma.user
                .findUnique({
                where: {
                    username: toModified,
                },
            })
                .then((userModified) => {
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.channelUser
                        .findUnique({
                        where: {
                            userId_channelId: {
                                userId,
                                channelId,
                            },
                        },
                        select: {
                            privilege: true,
                        },
                    })
                        .then((userPriv) => {
                        if (userPriv.privilege !== client_1.UserPrivilege.admin && userPriv.privilege !== client_1.UserPrivilege.owner) {
                            return new common_1.ForbiddenException('missing admin rights');
                        }
                        return resolve(new Promise((resolve, reject) => {
                            this.prisma.channelUser
                                .findUnique({
                                where: {
                                    userId_channelId: {
                                        userId: userModified.id,
                                        channelId,
                                    },
                                },
                                select: {
                                    privilege: true,
                                },
                            })
                                .then((modifPriv) => {
                                if (modifPriv.privilege === priv)
                                    return;
                                if ((modifPriv.privilege === 'admin' || modifPriv.privilege === 'owner') &&
                                    (priv === 'ban' || priv === 'muted')) {
                                    return reject(new common_1.ForbiddenException("can't ban/mute an admin/owner"));
                                }
                                if (priv === 'ban')
                                    return resolve(new Promise((resolve, reject) => {
                                        this.banUser(userModified.id, channelId, time)
                                            .then((ret) => {
                                            return resolve(ret);
                                        })
                                            .catch((err) => {
                                            return reject(err);
                                        });
                                    }));
                                else if (priv === 'muted') {
                                    return resolve(new Promise((resolve, reject) => {
                                        this.muteUser(userModified.id, channelId, time)
                                            .then((ret) => {
                                            return resolve(ret);
                                        })
                                            .catch((err) => {
                                            return reject(err);
                                        });
                                    }));
                                }
                                else {
                                    if (userPriv.privilege !== client_1.UserPrivilege.owner) {
                                        return new common_1.ForbiddenException('missing owner rights');
                                    }
                                    return resolve(new Promise((resolve, reject) => {
                                        this.changeUserPrivilege(userModified.id, channelId, time, priv)
                                            .then((ret) => {
                                            return resolve(ret);
                                        })
                                            .catch((err) => {
                                            return reject(err);
                                        });
                                    }));
                                }
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
    async banUser(userId, channelId, Time) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .update({
                where: {
                    userId_channelId: {
                        userId: userId,
                        channelId,
                    },
                },
                data: {
                    privilege: client_1.UserPrivilege.ban,
                    time: Time,
                    status: client_1.UserStatus.disconnected,
                },
            })
                .then(() => {
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async muteUser(userId, channelId, Time) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .update({
                where: {
                    userId_channelId: {
                        userId: userId,
                        channelId,
                    },
                },
                data: {
                    privilege: client_1.UserPrivilege.muted,
                    time: Time,
                },
            })
                .then(() => {
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async changeUserPrivilege(userId, channelId, Time, privilege) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .update({
                where: {
                    userId_channelId: {
                        userId: userId,
                        channelId,
                    },
                },
                data: {
                    privilege: privilege,
                },
            })
                .then(() => {
                return resolve();
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getChannelUser(channelId) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .findMany({
                where: {
                    channelId: channelId,
                },
                select: {
                    user: true,
                    privilege: true,
                    status: true,
                },
            })
                .then((ret) => {
                return resolve(ret.map((elem) => {
                    return {
                        privilege: elem.privilege,
                        username: elem.user.username,
                        nickname: elem.user.nickname,
                        status: elem.status,
                    };
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async getUserRoom(userId) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .findMany({
                where: {
                    userId: userId,
                    status: client_1.UserStatus.connected,
                },
                include: {
                    channel: {
                        include: {
                            messages: true,
                            users: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            })
                .then((ret) => {
                return resolve(ret.map((elem) => {
                    return {
                        channel: {
                            id: elem.channelId,
                            name: elem.channel.name,
                            type: elem.channel.type,
                        },
                        user: elem.channel.users.map((user) => {
                            return {
                                privilege: user.privilege,
                                username: user.user.username,
                                nickname: user.user.nickname,
                                id: user.user.id,
                                status: user.status,
                            };
                        }),
                        message: elem.channel.messages.map((msg) => {
                            return { content: msg.content, username: msg.username };
                        }),
                    };
                }));
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async JoinChannelByName(name, userId, dto) {
        return new Promise((resolve, reject) => {
            this.prisma.channel
                .findUnique({
                where: {
                    name: name,
                },
                select: {
                    id: true,
                },
            })
                .then((channel) => {
                if (channel) {
                    return resolve(new Promise((resolve, reject) => {
                        this.joinChannelById(userId, channel.id, dto)
                            .then((room) => {
                            return resolve(room);
                        })
                            .catch((err) => {
                            return reject(err);
                        });
                    }));
                }
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async RemoveUser(userId, channelId) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .delete({
                where: { userId_channelId: { userId, channelId } },
                select: {
                    channel: true,
                },
            })
                .then((chan) => {
                return resolve(chan.channel);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async CreateDm(userId, to) {
        return new Promise((resolve, reject) => {
            this.prisma.channel
                .create({
                data: {
                    id: userId + '__' + to,
                    type: client_1.ChannelType.dm,
                    name: null,
                    users: {
                        create: [
                            {
                                privilege: client_1.UserPrivilege.default,
                                status: client_1.UserStatus.connected,
                                user: { connect: { id: userId } },
                            },
                            {
                                privilege: client_1.UserPrivilege.default,
                                status: client_1.UserStatus.connected,
                                user: { connect: { id: to } },
                            },
                        ],
                    },
                },
                select: {
                    type: true,
                    id: true,
                    messages: true,
                    users: {
                        include: { user: true },
                    },
                },
            })
                .then((chan) => {
                return resolve({
                    channel: { name: null, type: chan.type, id: chan.id },
                    message: chan.messages.map((msg) => {
                        return { content: msg.content, username: msg.username };
                    }),
                    user: chan.users.map((user) => {
                        return {
                            username: user.user.username,
                            nickname: user.user.nickname,
                            id: user.user.id,
                            privilege: client_1.UserPrivilege.default,
                            status: user.status,
                        };
                    }),
                });
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async InviteUser(userId, userAdd, channelId) {
        return new Promise((resolve, reject) => {
            this.prisma.channelUser
                .findUnique({
                where: {
                    userId_channelId: { userId: userId, channelId: channelId },
                },
            })
                .then((user) => {
                if (userId === userAdd ||
                    !user ||
                    (user.privilege !== client_1.UserPrivilege.admin && user.privilege !== client_1.UserPrivilege.owner))
                    return reject(new common_1.ForbiddenException('acces denied'));
                return resolve(new Promise((resolve, reject) => {
                    this.prisma.channelUser
                        .findUnique({
                        where: {
                            userId_channelId: { userId: userAdd, channelId: channelId },
                        },
                    })
                        .then((user) => {
                        if (!user) {
                            this.prisma.channelUser
                                .create({
                                data: {
                                    channelId: channelId,
                                    userId: userAdd,
                                    privilege: client_1.UserPrivilege.default,
                                    status: client_1.UserStatus.invited,
                                },
                                select: {
                                    channel: {
                                        include: {
                                            messages: {
                                                include: {
                                                    user: true,
                                                },
                                            },
                                            users: {
                                                include: {
                                                    user: true,
                                                },
                                            },
                                        },
                                    },
                                    user: true,
                                },
                            })
                                .then((chanUser) => {
                                return resolve({
                                    channel: {
                                        id: channelId,
                                        name: chanUser.channel.name,
                                        type: chanUser.channel.type,
                                    },
                                    user: chanUser.channel.users.map((user) => {
                                        return {
                                            username: user.user.username,
                                            nickname: user.user.nickname,
                                            id: user.user.id,
                                            privilege: user.privilege,
                                            status: user.status,
                                        };
                                    }),
                                    message: chanUser.channel.messages.map((msg) => {
                                        return {
                                            content: msg.content,
                                            username: msg.username,
                                        };
                                    }),
                                });
                            })
                                .catch((err) => {
                                return reject(err);
                            });
                        }
                        else {
                            if (user && user.status !== client_1.UserStatus.disconnected)
                                return reject(new common_1.ForbiddenException('user already connect or invited'));
                            return resolve(new Promise((resolve, reject) => {
                                this.prisma.channelUser
                                    .update({
                                    where: {
                                        userId_channelId: {
                                            userId: userAdd,
                                            channelId: channelId,
                                        },
                                    },
                                    data: {
                                        status: client_1.UserStatus.invited,
                                    },
                                    select: {
                                        channel: {
                                            include: {
                                                messages: {
                                                    include: {
                                                        user: true,
                                                    },
                                                },
                                                users: {
                                                    include: {
                                                        user: true,
                                                    },
                                                },
                                            },
                                        },
                                        user: true,
                                    },
                                })
                                    .then((chanUser) => {
                                    return resolve({
                                        channel: {
                                            id: channelId,
                                            name: chanUser.channel.name,
                                            type: chanUser.channel.type,
                                        },
                                        user: chanUser.channel.users.map((user) => {
                                            return {
                                                username: user.user.username,
                                                nickname: user.user.nickname,
                                                id: user.user.id,
                                                privilege: user.privilege,
                                                status: user.status,
                                            };
                                        }),
                                        message: chanUser.channel.messages.map((msg) => {
                                            return {
                                                content: msg.content,
                                                username: msg.username,
                                            };
                                        }),
                                    });
                                })
                                    .catch((err) => {
                                    return reject(err);
                                });
                            }));
                        }
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
};
ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelService);
exports.ChannelService = ChannelService;
//# sourceMappingURL=channel.service.js.map