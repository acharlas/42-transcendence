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
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BlockDto } from './dto';
import { BlockService } from './block.service';

@Controller('Block')
@ApiTags('Block')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('block')
export class BlockController {
  constructor(
    private blockService: BlockService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  addBlock(
    @GetUser('id') userId: string,
    @Body() dto: BlockDto,
  ) {
    return this.blockService.addBlock(
      userId,
      dto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('remove')
  removeBlock(
    @GetUser('id') userId: string,
    @Body() dto: BlockDto,
  ) {
    return this.blockService.removeBlock(
      userId,
      dto,
    );
  }

  @Get(':id')
  getFriend(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.blockService.getBlock(userId, id);
  }
}
