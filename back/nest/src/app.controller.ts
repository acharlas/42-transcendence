import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from './user/models/user.entity';
import { UserI } from './user/models/user.interface';

@Controller() //localhost:3000/api/*
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
