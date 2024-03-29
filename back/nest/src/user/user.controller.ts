import { Body, Controller, ForbiddenException, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Achievement, User, UserHistory } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User): User {
    delete user.hash;
    delete user.refreshToken;
    return user;
  }

  @Get(':id')
  getUserId(@GetUser('id') userId: string, @Param('id') id: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userService
        .getUserId(userId, id)
        .then((ret) => {
          delete ret.mfaEnabled;
          delete ret.mfaPhoneNumber;
          delete ret.hash;
          delete ret.refreshToken;
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Get()
  getUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.userService
        .getUsers()
        .then((ret) => {
          ret.forEach((x) => {
            delete x.mfaEnabled;
            delete x.mfaPhoneNumber;
            delete x.hash;
            delete x.refreshToken;
          });
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Get('history/:id')
  getUserHistory(@Param('id') userId: string): Promise<{ history: UserHistory[] }> {
    return new Promise<{ history: UserHistory[] }>((resolve, reject) => {
      this.userService
        .getHistory(userId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Get('achievement/me')
  getAchievement(@GetUser('id') userId: string): Promise<Achievement[]> {
    return new Promise<Achievement[]>((resolve, reject) => {
      this.userService
        .GetAchievement(userId)
        .then((ret) => {
          return resolve(ret);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userService
        .editUser(userId, dto)
        .then((user) => {
          return resolve(user);
        })
        .catch((err) => {
          console.log(err);
          return reject(new ForbiddenException('nickname already taken'));
        });
    });
  }
}
