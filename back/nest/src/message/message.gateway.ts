import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User, UserPrivilege, UserType } from '@prisma/client';
import { Server, Socket, Namespace } from 'socket.io';
import { BlockService } from 'src/block/block.service';
import { CreateChannelDto, EditChannelDto } from 'src/channel/dto';
import { FriendService } from 'src/friend/friend.service';
import { GameGateway } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';
import { PlayerIsInLobby, PlayerIsInWatching } from 'src/game/game.utils';
import { Lobby } from 'src/game/types_game';
import { UserService } from 'src/user/user.service';
import { ChannelService } from '../channel/channel.service';
import { socketTab, SocketWithAuth } from './types_message';

@WebSocketGateway({
  namespace: 'chat',
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private channelService: ChannelService,
    private friendService: FriendService,
    private blockService: BlockService,
    private userService: UserService,
    private gameGateWay: GameGateway,
    private gameService: GameService,
  ) {}

  SocketList: socketTab[] = [];

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;

    const find = this.SocketList.find((socket) => {
      if (socket.userId === client.userID) return true;
      return false;
    });
    if (find) {
      console.log('find:', find);
      if (find.socket.id !== client.id) {
        find.socket.emit('Disconnect');
        this.SocketList = this.SocketList.filter((socket) => {
          if (socket.socket.id === find.socket.id) return false;
          return true;
        });
        find.socket.disconnect();
      }
    }
    this.SocketList.push({ userId: client.userID, socket: client });
    //Inform frontend clients
    this.io.emit(
      'OnlineList',
      this.SocketList.map(function (a) {
        return a.userId;
      }),
    );

    console.log('Socket list after connection: ', this.SocketList);
    console.log(`Number of sockets connected: ${socket.size}`);

    this.channelService
      .getUserRoom(client.userID)
      .then((res) => {
        console.log('room on connection:', { res });
        client.emit('Rooms', res);
        res.forEach((room) => {
          client.join(room.channel.id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.friendService
      .getFriendList(client.userID)
      .then((friendList) => {
        console.log('send friend list: ', friendList);
        client.emit('FriendList', friendList);
      })
      .catch((err) => {
        console.log(err);
      });
    this.blockService
      .getBlockList(client.userID)
      .then((bloquedList) => {
        client.emit('BloquedList', bloquedList);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(`Client connected: ${client.id} | userid: ${client.userID} | name: ${client.username}`);
  }

  handleDisconnect(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.SocketList = this.SocketList.filter((sock) => {
      if (sock.userId === client.userID) return false;
      return true;
    });
    //Inform frontend clients
    this.io.emit(
      'OnlineList',
      this.SocketList.map(function (a) {
        return a.userId;
      }),
    );

    console.log(`Client disconnected: ${client.id} | name: ${client.username}`);
    console.log('Socket list after disconnection: ', this.SocketList);
    console.log(`Number of sockets connected: ${socket.size}`);
  }

  /*==========================================*/
  /*HANDSHAKE*/
  @SubscribeMessage('handshake')
  handshake(client: SocketWithAuth): Promise<void> {
    console.log('sending back user id....');
    client.emit('new_user', client.id);
    return;
  }
  /*==========================================*/
  /*USER CREATE A ROOM*/
  @SubscribeMessage('CreateRoom')
  CreateRoom(
    @MessageBody('CreateChannelDto') roomDto: CreateChannelDto,
    @ConnectedSocket()
    client: SocketWithAuth,
  ): Promise<void> {
    console.log('id:', client.userID, { roomDto });
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .createChannel(client.userID, roomDto)
        .then((ret) => {
          console.log('NewRoom Create Send: ', { ret });
          client.join(ret.channel.id);
          client.emit('NewRoom', { room: ret });
          return resolve();
        })
        .catch((err) => {
          console.log('error create channel: ', err);
          client.emit('ErrMessage', { code: 'err31' });
          return reject(err);
        });
    });
  }

  /*==========================================*/
  /*USER SENDS A ROOM MESSAGE*/
  @SubscribeMessage('SendRoomMessage')
  sendRoomMessage(
    @MessageBody('roomId') roomId: string,
    @MessageBody('message') message: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('new message arrive:', message, 'on room: ', roomId);
    return new Promise<void>((resolve, reject) => {
      console.log('SendRoom message', { message }, 'channelId:', roomId);
      this.channelService
        .addChannelMessage(client.userID, roomId, client.username, message)
        .then((ret) => {
          console.log('message resend:', ret, 'roomid: ', roomId);
          client.broadcast.to(roomId).emit('RoomMessage', { roomId: roomId, message: ret });
          client.emit('RoomMessage', { roomId: roomId, message: ret });
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*=====================================*/
  /* USER JOINS A ROOM*/
  @SubscribeMessage('JoinRoom')
  joinRoom(
    @MessageBody('name') name: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('join room:', name, 'pass', password);
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .JoinChannelByName(name, client.userID, { password: password })
        .then((ret) => {
          client.join(ret.channel.id);
          client.emit('NewRoom', { room: ret, itch: true });
          client.broadcast.to(ret.channel.id).emit('JoinRoom', {
            id: ret.channel.id,
            user: ret.user.find((user) => {
              if (user.username === client.username) return true;
              return false;
            }),
          });
          return resolve();
        })
        .catch((err) => {
          console.log('MESSAGE: ', err.message);
          if (err.message) client.emit('ErrMessage', { code: err.message });
          return reject(err);
        });
    });
  }

  /*=====================================*/
  /* USER LEAVES A ROOM*/
  @SubscribeMessage('LeaveRoom')
  LeaveRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('leave room: ', roomId);
    return new Promise<void>((resolve, reject) => {
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

  /*============================================*/
  /*============================================*/
  /*UPDATE USER PRIVILEGES*/
  @SubscribeMessage('UpdateUserPrivilege')
  UpdateUserPrivilege(
    @MessageBody('roomId') roomId: string,
    @MessageBody('privilege') privilege: UserPrivilege,
    @MessageBody('time') time: Date,
    @MessageBody('toModifie') toModifie: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('date: ', time, 'Privilege: ', privilege);
    return new Promise<void>((resolve, reject) => {
      console.log('update user: ', toModifie, 'with pricilege: ', privilege);
      this.channelService
        .channelUserUpdate(client.userID, toModifie, roomId, privilege, time)
        .then((ret) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.channelService
                .getChannelUser(roomId)
                .then((user) => {
                  console.log('send msg back');
                  client.to(roomId).emit('UpdateUserList', { roomId: roomId, user: user });
                  client.emit('UpdateUserList', { roomId: roomId, user: user });
                  if (privilege === UserPrivilege.ban) {
                    const sock = this.SocketList.find((sock) => {
                      if (sock.socket.username === toModifie) return true;
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
              console.log(err);
              return reject(err);
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*============================================*/
  /*BAN USER*/
  @SubscribeMessage('UpdateUserPrivilege')
  BanUser(
    @MessageBody('user') user: string,
    @MessageBody('Date') time: Date,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('date');
    return new Promise<void>((resolve, reject) => {
      return resolve();
    });
  }

  /*============================================*/
  /*ADD FRIEND*/
  @SubscribeMessage('AddFriend')
  addFriend(@MessageBody('newFriend') friend: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('newFriend', friend);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(friend)
        .then((user) => {
          if (!user) {
            console.log('friend not found: ', friend);
            client.emit('ErrMessage', { code: 'err12' });
            return;
          }
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.friendService
                .addFriend(client.userID, { userId: user.id })
                .then((ret) => {
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.friendService
                        .getFriendList(client.userID)
                        .then((friendList) => {
                          client.emit('FriendList', friendList);
                          return resolve();
                        })
                        .catch((err) => {
                          console.log(err);
                          return reject(err);
                        });
                    }),
                  );
                })
                .catch((err) => {
                  console.log(err);
                  return reject(err);
                });
            }),
          );
        })
        .catch((err) => {
          console.log(err);
          client.emit('ErrMessage', { code: 'err11' });
          return reject(err);
        });
    });
  }

  /*============================================*/
  /*ADD BLOCK*/
  @SubscribeMessage('AddBlock')
  addBlock(@MessageBody('newBlock') Block: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('newBlock', Block);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(Block)
        .then((user) => {
          if (!user) {
            client.emit('ErrMessage', { code: 'err22' });
            return;
          }
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.blockService
                .addBlock(client.userID, { userId: user.id })
                .then((ret) => {
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.blockService
                        .getBlockList(client.userID)
                        .then((bloquedList) => {
                          client.emit('BloquedList', bloquedList);
                          return resolve();
                        })
                        .catch((err) => {
                          console.log(err);
                          return reject();
                        });
                    }),
                  );
                })
                .catch((err) => {
                  console.log(err);
                  client.emit('ErrMessage', { code: 'err21' });
                  return reject(err);
                });
            }),
          );
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*============================================*/
  /*REMOVE FRIEND*/
  @SubscribeMessage('RemoveFriend')
  RemoveFriend(@MessageBody('username') remove: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('remove friend: ', remove);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(remove)
        .then((user) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.friendService
                .removeFriend(client.userID, { userId: user.id })
                .then((ret) => {
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.friendService
                        .getFriendList(client.userID)
                        .then((friendList) => {
                          client.emit('FriendList', friendList);
                          return resolve();
                        })
                        .catch((err) => {
                          console.log(err);
                          return reject(err);
                        });
                    }),
                  );
                })
                .catch((err) => {
                  console.log(err);
                  return reject();
                });
            }),
          );
        })
        .then((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*============================================*/
  /*REMOVE BLOCK*/
  @SubscribeMessage('RemoveBlock')
  RemoveBlock(@MessageBody('username') remove: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('remove block: ', remove);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(remove)
        .then((user) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.blockService
                .removeBlock(client.userID, { userId: user.id })
                .then((ret) => {
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.blockService
                        .getBlockList(client.userID)
                        .then((bloquedList) => {
                          client.emit('BloquedList', bloquedList);
                          return resolve();
                        })
                        .catch((err) => {
                          console.log(err);
                          return reject(err);
                        });
                    }),
                  );
                })
                .catch((err) => {
                  console.log(err);
                  return reject();
                });
            }),
          );
        })
        .then((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*============================================*/
  /*UPDATE ROOM*/
  @SubscribeMessage('UpdateRoom')
  UpdateRoom(
    @MessageBody('roomId') roomId: string,
    @MessageBody('updateChannelDto') dto: EditChannelDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('update channel: ', roomId, 'with: ', { dto });
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .editChannel(client.userID, roomId, dto)
        .then((channel) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              const updateChan = {
                id: channel.id,
                name: channel.name,
                type: channel.type,
              };
              console.log('sending update room');
              client.broadcast.emit('UpdateRoom', updateChan);
              client.emit('UpdateRoom', updateChan);
              return resolve();
            }),
          );
        })
        .catch((err) => {
          console.log(err);
          client.emit('ErrMessage', { code: err.message });
          return reject(err);
        });
    });
  }

  /*============================================*/
  /*DM USER*/
  @SubscribeMessage('Dm')
  Dm(@MessageBody('sendTo') sendTo: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('create dm room: ', sendTo);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(sendTo)
        .then((to) => {
          this.channelService
            .CreateDm(client.userID, to.id)
            .then((room) => {
              client.emit('NewRoom', { room, itch: true });
              client.join(room.channel.id);
              const sock = this.SocketList.find((sock) => {
                if (sock.userId === to.id) return true;
                return false;
              });
              sock.socket.join(room.channel.id);
              sock.socket.emit('NewRoom', { room, itch: false });
              return resolve();
            })
            .catch((err) => {
              console.log(err);
              return reject;
            });
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*============================================*/
  /*INVITE USER TO CHANNEL*/
  @SubscribeMessage('InviteUser')
  InviteUser(
    @MessageBody('user') user: string,
    @MessageBody('channel') channel: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('invite User: ', user, ' to: ', channel);
    return new Promise<void>((resolve, reject) => {
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
          console.log(err);
          return reject;
        });
    });
  }
  /*============================================*/
  /*invite a player to a lobby*/
  @SubscribeMessage('InviteUserInGame')
  InviteUserInGame(
    @MessageBody('inviteId') inviteId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('InviteUserInGame: ', inviteId);
    const addPlayerToRoom = (lobby: Lobby, user: User): void => {
      const gameSocket = this.gameGateWay.SocketList.find((socket) => {
        if (socket.userId === client.userID) return true;
        return false;
      });
      if (gameSocket) {
        gameSocket.socket.join(lobby.id);
        gameSocket.socket.emit('JoinLobby', lobby);
      } else client.emit('JoinGame');
      const inviteSocket = this.SocketList.find((socket) => {
        if (socket.userId === inviteId) return true;
        return false;
      });
      if (inviteSocket)
        inviteSocket.socket.emit('GameInvite', {
          id: user.id,
          username: user.username,
        });
      return;
    };

    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUserUsername(client.userID)
        .then((user) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.gameService
                .FindPLayerLobby(client.userID)
                .then((lobby) => {
                  if (!lobby || PlayerIsInWatching(client.userID, lobby)) {
                    return resolve(
                      new Promise<void>((resolve, reject) => {
                        this.gameService
                          .CreateLobby(client.userID)
                          .then((lobby) => {
                            return resolve(addPlayerToRoom(lobby, user));
                          })
                          .catch((err) => {
                            console.log(err);
                            return reject(err);
                          });
                      }),
                    );
                  } else {
                    return resolve(addPlayerToRoom(lobby, user));
                  }
                })
                .catch((err) => {
                  console.log(err);
                  return reject;
                });
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  /*============================================*/
  /*============================================*/
  /*invite a player to a lobby*/
  @SubscribeMessage('AccepteGameInvite')
  AccepteGameInvite(@MessageBody('userid') userid: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('AccepteGameInvite: ', userid);
    return new Promise<void>((resolve, reject) => {
      const lobby = this.gameService.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userid, lobby);
      });
      if (!lobby) return reject();
      this.gameService
        .JoinLobby(client.userID, lobby.id)
        .then((lobby) => {
          console.log('has join');
          const gameSocket = this.gameGateWay.SocketList.find((socket) => {
            if (socket.userId === client.userID) return true;
            return false;
          });
          if (gameSocket) {
            gameSocket.socket.emit('JoinLobby', lobby);
            gameSocket.socket.join(lobby.id);
          } else client.emit('JoinGame');
          const gameHostSocket = this.gameGateWay.SocketList.find((socket) => {
            if (socket.userId === userid) return true;
            return false;
          });
          if (gameHostSocket) gameHostSocket.socket.emit('JoinLobby', lobby);
        })
        .catch((err) => {
          console.log('join err:', err);
          return reject();
        });
      return resolve();
    });
  }
  /*============================================*/
  /*============================================*/
  /*invite a player to a lobby*/
  @SubscribeMessage('WatchPartie')
  WatchPartie(@MessageBody('userId') userId: string, @ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('watch: ', userId);
    return new Promise<void>((resolve, reject) => {
      const lobby = this.gameService.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject('No lobby to spectate');
      this.gameService
        .JoinViewer(client.userID, lobby.id)
        .then((lobby) => {
          const gameSocket = this.gameGateWay.SocketList.find((socket) => {
            if (socket.userId === client.userID) return true;
            return false;
          });
          if (gameSocket) {
            gameSocket.socket.join(lobby.id);
            gameSocket.socket.emit('JoinSpectate', lobby);
          } else client.emit('JoinGame');
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
      return resolve();
    });
  }
  /*============================================*/
}
