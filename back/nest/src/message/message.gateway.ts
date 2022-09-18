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
import { Server, Socket, Namespace } from 'socket.io';
import { ChannelService } from '../channel/channel.service';
import { GetAllMessageDto } from './dto';
import { MessageService } from './message.service';
import { SocketWithAuth } from './types_message';

@WebSocketGateway({
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private channelService: ChannelService,
  ) {}

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.channelService
      .getChannels('public')
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

  @SubscribeMessage('CreateRoom')
  CreateRoom(
    @MessageBody('old') oldRoom: string,
    @MessageBody('roomName') roomName: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('id:', client.userID);
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .createChannel(client.userID, {
          name: roomName,
          type: 'public',
          password: '',
        })
        .then((ret) => {
          console.log({ ret });
          client.leave(oldRoom);
          client.join(ret.id);
          return resolve(
            new Promise<void>((resolve, reject) => {
              this.channelService
                .getChannels('public')
                .then((res) => {
                  console.log(res);
                  client.broadcast.emit('Rooms', { rooms: res });
                  client.emit('Rooms', { rooms: res });
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
    const date = new Date();
    return new Promise<void>((resolve, reject) => {
      console.log('SendRoom message', { message }, 'channelId:', roomId);
      this.channelService
        .addChannelMessage(client.userID, roomId, client.username, message)
        .then((ret) => {
          console.log('message send back: ', { ret }, 'to: ', roomId);
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
  @SubscribeMessage('JoinRoom')
  joinRoom(
    @MessageBody('old') oldRoom: string,
    @MessageBody('key') roomId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .joinChannelById(client.userID, roomId, {})
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
  /*============================================*/
  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody() getAllMessageDto: GetAllMessageDto) {
    return new Promise<unknown[]>((resolve, reject) => {
      console.log('findAllMessages');
      this.messageService
        .findAll()
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.messageService
        .getClientName(client.id)
        .then((ret) => {
          client.broadcast.emit('typing', { ret, isTyping });
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
