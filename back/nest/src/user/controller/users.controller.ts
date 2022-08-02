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
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { UserDto } from '../dto/user.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';


@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get()
  @ApiPaginatedResponse(UserDto)
  async getUsers(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    return this.usersService.getUsers(pageOptionsDto)
  }
  // @Post()
  // @ApiCreatedResponse({
  //   description: 'User as been successfully created',
  //   type: UserEntity
  // })
  // @ApiForbiddenResponse({ description: 'Forbidden' })
  // create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
  //   return this.usersService.create(createUserDto);
  // }

  

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
