import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UserI } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Post()
    add(@Body() user: UserI): Observable<UserI> {
        return this.userService.addUser(user);
    }

    @Get()
    findAll(): Observable<UserI[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    findById(@Param('id') id: string): Observable<UserI> {
        return this.userService.findUserById(id);
    }

    @Put(':id')
    updateUser(
        @Param('id') id: string,
        @Body() user: UserI
        ): Observable<UpdateResult> {
        return this.userService.updateUser(id, user)
    }
   
}