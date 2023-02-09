import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BlockDto } from './dto';
import { BlockService } from './block.service';
import { User } from '@prisma/client';

@Controller('Block')
@ApiTags('Block')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('block')
export class BlockController {
  constructor(private blockService: BlockService) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  addBlock(
    @GetUser('id') userId: string,
    @Body() dto: BlockDto,
  ): Promise<{ myblock: User[] }> {
    return new Promise<{ myblock: User[] }>((resolve, reject) => {
      this.blockService
        .addBlock(userId, dto)
        .then((ret) => {
          ret.myblock.forEach(x=>{
            delete x.mfaEnabled;
            delete x.mfaPhoneNumber;
            delete x.hash;
            delete x.refreshToken;
          })
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('remove')
  removeBlock(
    @GetUser('id') userId: string,
    @Body() dto: BlockDto,
  ): Promise<{ myblock: User[] }> {
    return new Promise<{ myblock: User[] }>((resolve, reject) => {
      this.blockService
        .removeBlock(userId, dto)
        .then((ret) => {
          ret.myblock.forEach(x=>{
            delete x.mfaEnabled;
            delete x.mfaPhoneNumber;
            delete x.hash;
            delete x.refreshToken;
          })
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Get(':id')
  getblock(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<{ myblock: User[] }> {
    return new Promise<{ myblock: User[] }>((resolve, reject) => {
      this.blockService
        .getBlock(userId, id)
        .then((ret) => {
          ret.myblock.forEach(x=>{
            delete x.mfaEnabled;
            delete x.mfaPhoneNumber;
            delete x.hash;
            delete x.refreshToken;
          })
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
