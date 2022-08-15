import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User, UserHistory } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User): User {
    return user;
  }

  @Get(':id')
  getUserId(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.getUserId(userId, id);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('history/:id')
  getUserHistory(
    @Param('id') userId: string,
  ): Promise<{ history: UserHistory[] }> {
    return this.userService.getHistory(userId);
  }

  @Patch()
  editUser(
    @GetUser('id') userId: string,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(userId, dto);
  }
}
