import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';

@Controller('channels')
@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class MessageController {}
