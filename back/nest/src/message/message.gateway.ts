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
  // @SubscribeMessage('createMessage')
  // create(
  //   @GetUser('id') userId: string,
  //   @MessageBody() createMessageDto: CreateMessageDto,
  // ): Promise<CreateMessageDto> {
  //   return this.messageService.postMessage(
  //     userId,
  //     createMessageDto.channelId,
  //     createMessageDto,
  //   );
  // }

  // @SubscribeMessage('join')
  // joinRoom() {}

  // @SubscribeMessage('findAllMessages')
  // findAll(@MessageBody() getAllMessageDto: GetAllMessageDto) {
  //   return this.messageService.getMessagesfromChannel(
  //     getAllMessageDto.channelId,
  //   );
  // }

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

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ): Promise<unknown[]> {
    return new Promise<unknown[]>((resolve, reject) => {
      this.messageService
        .identify(name, client.id)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

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
