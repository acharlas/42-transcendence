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
import { UserPrivilege } from '@prisma/client';
import { Server, Socket, Namespace } from 'socket.io';
import { BlockService } from 'src/block/block.service';
import { CreateChannelDto, EditChannelDto } from 'src/channel/dto';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { ChannelService } from '../channel/channel.service';
import { socketTab, SocketWithAuth } from './types_message';

@WebSocketGateway({
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private channelService: ChannelService,
    private friendService: FriendService,
    private blockService: BlockService,
    private userService: UserService,
  ) {}

  SocketList: socketTab[] = [];

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;

    console.log('socket list: ', this.SocketList);
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
    console.log(
      `Client connected: ${client.id} | userid: ${client.userID} | name: ${client.username}`,
    );
    console.log(`number of soket connected: ${socket.size}`);
  }

  handleDisconnect(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.SocketList = this.SocketList.filter((sock) => {
      if (sock.userId === client.userID) return false;
      return true;
    });
    console.log(`Client disconnected: ${client.id} | name: ${client.username}`);
    console.log(`number of soket connected: ${socket.size}`);
  }

  /*==========================================*/
  /*USER CREATE A ROOM*/
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
          return reject(err);
        });
    });
  }

  /*==========================================*/
  /*USER SEND A ROOM MESSAGE*/
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
          client.broadcast
            .to(roomId)
            .emit('RoomMessage', { roomId: roomId, message: ret });
          client.emit('RoomMessage', { roomId: roomId, message: ret });
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*=====================================*/
  /* USER JOIN A ROOM*/
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
          return reject(err);
        });
    });
  }

  /*=====================================*/
  /* USER JOIN A ROOM*/
  @SubscribeMessage('LeaveRoom')
  LeaveRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
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
  /*User uppdate*/
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
          console.log('uwerqwuo');
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.channelService
                .getChannelUser(roomId)
                .then((user) => {
                  console.log('send msg back');
                  client
                    .to(roomId)
                    .emit('UpdateUserList', { roomId: roomId, user: user });
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
  /*============================================*/
  /*Ban User*/
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
  /*============================================*/
  /*addFriend*/
  @SubscribeMessage('AddFriend')
  addFriend(
    @MessageBody('newFriend') friend: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('newFriend', friend);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(friend)
        .then((user) => {
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
                          return reject();
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
          return reject();
        });
    });
  }

  /*============================================*/
  /*============================================*/
  /*============================================*/
  /*addFriend*/
  @SubscribeMessage('AddBlock')
  addBlock(
    @MessageBody('newBlock') Block: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('newBlock', Block);
    return new Promise<void>((resolve, reject) => {
      this.userService
        .getUser(Block)
        .then((user) => {
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
  /*============================================*/
  /*remove Friend*/
  @SubscribeMessage('RemoveFriend')
  RemoveFriend(
    @MessageBody('username') remove: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
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
  /*============================================*/
  /*remove block*/
  @SubscribeMessage('RemoveBlock')
  RemoveBlock(
    @MessageBody('username') remove: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
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
  /*============================================*/
  /*remove block*/
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
          return reject();
        });
    });
  }
  /*============================================*/
  /*============================================*/
  /*remove block*/
  @SubscribeMessage('Dm')
  Dm(
    @MessageBody('sendTo') sendTo: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
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
}
