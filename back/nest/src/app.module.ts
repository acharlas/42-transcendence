import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm' 
import {config} from './orm.config'
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UsersModule
  ],
})
export class AppModule {}
