import { Injectable } from '@nestjs/common';
import {Socket} from "socket.io";
import { socketTab } from 'src/message/types_message';

@Injectable()
export class SocketService {
  gameSockets:socketTab[] = [];
  chatSockets:socketTab[] = [];
}
