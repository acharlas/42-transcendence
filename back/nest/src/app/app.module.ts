import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { UsersModule } from '../modules/user/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(config),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
