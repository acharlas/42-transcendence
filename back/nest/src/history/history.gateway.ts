import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class HistoryGateway {
  constructor(
    private readonly historyService: HistoryService,
  ) {}

  @SubscribeMessage('createHistory')
  create(
    @MessageBody()
    createHistoryDto: CreateHistoryDto,
  ) {
    return this.historyService.createhistory(
      createHistoryDto,
    );
  }
}
