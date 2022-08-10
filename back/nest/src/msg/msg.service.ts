import {
  Injectable,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { connect } from 'http2';
import { use } from 'passport';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMsgDto } from './dto';

@Injectable()
export class MsgService {
  constructor(private prisma: PrismaService) {}

  getMsg(userId: string) {
    return this.prisma.msg.findMany({
      where: {
        userId,
      },
    });
  }

  getMsgById(userId: string, msgId: string) {}

  async createMsg(
    userId: string,
    dto: CreateMsgDto,
  ) {
    /*const bookmark = await this.prisma.msg.create(
      {
        data: {
          ...dto,
          users: {
            connect: {id: userId}
          }
          channel: {connect: {id: }}
        },
      },
    );

    return bookmark;*/
    return;
  }

  deleteMsgById(userId: string, msgId: string) {}
}
