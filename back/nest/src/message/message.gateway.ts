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
import { GetAllMessageDto } from './dto';
import { MessageService } from './message.service';
import { CreateChannelDto } from 'src/channel/dto';
import { SocketWithAuth } from './types';

@WebSocketGateway({
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessageService) {}

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    console.log(
      `Client connected: ${client.id} | pollid: ${client.pollID} | name: ${client.name}`,
    );
    console.log(`number of soket connected: ${socket.size}`);
  }

  handleDisconnect(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    console.log(
      `Client disconnected: ${client.id} | pollid: ${client.pollID} | name: ${client.name}`,
    );
    console.log(`number of soket connected: ${socket.size}`);
  }

  @SubscribeMessage('CreateRoom')
  CreateRoom(
    @MessageBody('old') oldRoom: string,
    @MessageBody('dto') dto: CreateChannelDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log({ client });
    return;
    // return new Promise<void>((resolve, reject) => {
    //   this.channelService
    //     .createChannel(userId, dto)
    //     .then((ret) => {
    //       console.log({ ret });
    //       client.leave(oldRoom);
    //       client.join(ret.id);
    //       client.broadcast.emit('Rooms', { id: ret.id, name: ret.name });
    //       client.emit('Rooms', { id: ret.id, name: ret.name });
    //       client.emit('JoinedRoom', ret.id, oldRoom);
    //       return resolve();
    //     })
    //     .catch((err) => {
    //       return reject(err);
    //     });
    //});
  }
  /*==========================================*/

  /*USER SEND A ROOM MESSAGE*/
  @SubscribeMessage('SendRoomMessage')
  sendRoomMessage(
    @MessageBody('roomId') roomId: string,
    @MessageBody('message') message: string,
    @MessageBody('username') username: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const date = new Date();

    client.to(roomId).emit('RoomMessage', {
      message,
      username,
      time: `${date.getHours()}:${date.getMinutes()}`,
    });
    return;
  }
  /*=====================================*/
  /*JOINING ROOM */
  @SubscribeMessage('JoinRoom')
  joinRoom(
    @MessageBody('old') oldRoom: string,
    @MessageBody('key') roomId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log({ roomId });
    client.leave(oldRoom);
    client.join(roomId);
    client.emit('JoinedRoom', roomId);
    console.log(roomId);
    return;
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
