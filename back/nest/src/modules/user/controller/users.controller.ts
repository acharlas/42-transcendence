import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../dtos/user.dto';

import { CreateUserDto } from '../dtos/createUserDto';
import { UserEntity } from '../entities/user.entity';


@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get()
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersService.getUsers()
  }


  @Post()
  @ApiCreatedResponse({description: 'User as been successfully created',type: UserDto})
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.createUser(createUserDto);
    return user.toDto()
  }

  

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
