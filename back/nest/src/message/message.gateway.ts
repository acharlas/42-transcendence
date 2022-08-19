import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GetUser } from 'src/auth/decorator';
import { CreateMessageDto, GetAllMessageDto } from './dto';
import { MessageService } from './message.service';

/*@WebSocketGateway({ namespace: 'chat' })
export class MessageGateway {
  constructor(private messageService: MessageService) {}

  @SubscribeMessage('createMessage')
  create(
    @GetUser('id') userId: string,
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<CreateMessageDto> {
    return this.messageService.postMessage(
      userId,
      createMessageDto.channelId,
      createMessageDto,
    );
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody() getAllMessageDto: GetAllMessageDto) {
    return this.messageService.getMessagesfromChannel(
      getAllMessageDto.channelId,
    );
  }
}*/
