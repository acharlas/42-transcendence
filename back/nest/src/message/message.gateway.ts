import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GetAllMessageDto } from './dto';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelService } from 'src/channel/channel.service';
import { CreateChannelDto } from 'src/channel/dto';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private messageService: MessageService,
    private prisma: PrismaService,
    private channelService: ChannelService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`CLient disconnected ${client.id}`);
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
