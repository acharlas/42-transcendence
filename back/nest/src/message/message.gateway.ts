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
import { CreateChannelDto } from 'src/channel/dto';
import { ChannelService } from '../channel/channel.service';
import { SocketWithAuth } from './types_message';

@WebSocketGateway({
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private channelService: ChannelService) {}

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.channelService
      .getChannels(client.userID)
      .then((res) => {
        console.log(res);
        client.broadcast.emit('Rooms', { rooms: res });
        client.emit('Rooms', { rooms: res });
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
    console.log(`Client disconnected: ${client.id} | name: ${client.username}`);
    console.log(`number of soket connected: ${socket.size}`);
  }

  /*==========================================*/
  /*USER CREATE A ROOM*/
  @SubscribeMessage('CreateRoom')
  CreateRoom(
    @MessageBody('old') oldRoom: string,
    @MessageBody('CreateChannelDto') roomDto: CreateChannelDto,
    @ConnectedSocket()
    client: SocketWithAuth,
  ): Promise<void> {
    console.log('id:', client.userID, { roomDto });
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .createChannel(client.userID, roomDto)
        .then((ret) => {
          console.log({ ret });
          client.leave(oldRoom);
          client.join(ret.id);
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.channelService
                .getChannels(client.userID)
                .then((res) => {
                  console.log('room return:', res);
                  client.broadcast.emit('Rooms', { rooms: res });
                  client.emit('Rooms', { rooms: res });
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.channelService
                        .getChannelUser(ret.id)
                        .then((user) => {
                          client.emit('userList', { user });
                          client.broadcast
                            .to(ret.id)
                            .emit('userList', { user });
                          return resolve(
                            new Promise<void>((resolve, reject) => {
                              this.channelService
                                .getChannelMessage(ret.id, client.userID)
                                .then((res) => {
                                  client.emit('JoinedRoom', {
                                    roomId: ret.id,
                                    message: res,
                                  });
                                  return resolve();
                                })
                                .catch((err) => {
                                  return reject(err);
                                });
                            }),
                          );
                        })
                        .catch((err) => {
                          return reject(err);
                        });
                    }),
                  );
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
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
    return new Promise<void>((resolve, reject) => {
      console.log('SendRoom message', { message }, 'channelId:', roomId);
      this.channelService
        .addChannelMessage(client.userID, roomId, client.username, message)
        .then((ret) => {
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.channelService
                .getChannelMessage(roomId, client.userID)
                .then((res) => {
                  client.broadcast.to(roomId).emit('newMessage', {
                    message: res,
                  });
                  return resolve();
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
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
    @MessageBody('old') oldRoom: string,
    @MessageBody('key') roomId: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('join room:', roomId, 'old room:', oldRoom, 'pass', password);
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .joinChannelById(client.userID, roomId, { password: password })
        .then((ret) => {
          console.log({ roomId });
          client.leave(oldRoom);
          client.join(roomId);
          console.log(roomId);
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.channelService
                .getChannelMessage(roomId, client.userID)
                .then((res) => {
                  console.log('join message', res);
                  client.emit('JoinedRoom', { roomId: roomId, message: res });
                  return resolve(
                    new Promise<void>((resolve, reject) => {
                      this.channelService
                        .getChannelUser(roomId)
                        .then((user) => {
                          client.emit('userList', { user });
                          client.broadcast
                            .to(roomId)
                            .emit('userList', { user });
                        })
                        .catch((err) => {
                          return reject(err);
                        });
                    }),
                  );
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
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
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .leaveChannel(client.userID, roomId)
        .then((ret) => {
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
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .channelUserUpdate(client.userID, toModifie, roomId, privilege, time)
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*============================================*/
}
