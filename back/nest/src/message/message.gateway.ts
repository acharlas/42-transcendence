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
import { CreateMessageDto, GetAllMessageDto } from './dto';
import { MessageService } from './message.service';
import { nanoid } from 'nanoid';

const EVENTS = {
  connecttion: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
  },
};

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private messageService: MessageService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`CLient disconnected ${client.id}`);
  }

  @SubscribeMessage('createMessage')
  create(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<CreateMessageDto> {
    return new Promise<CreateMessageDto>((resolve, reject) => {
      this.messageService
        .create(createMessageDto)
        .then((ret) => {
          this.server.emit('message', ret);
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  /* USER CREATE A NEW ROOM*/
  rooms: Record<string, { name: string }> = {};

  @SubscribeMessage('CreateRoom')
  CreateRoom(
    @MessageBody('roomName') roomName: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const roomId = nanoid();

    this.rooms[roomId] = {
      name: roomName,
    };

    client.join(roomId);
    client.broadcast.emit('Rooms', this.rooms);
    client.emit('Rooms', this.rooms);
    client.emit('JoinedRoom', roomId);
    return;
  }
  /*==========================================*/

  /*USER SEND A ROOM MESSAGE*/
  @SubscribeMessage('SendRoomMessage')
  sendRoomMessage(
    @MessageBody('roomId') roomId: string,
    @MessageBody('message') message: string,
    @MessageBody('roomId') username: string,
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
    @MessageBody('key') roomId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log({ roomId });
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
