import {TypeOrmModuleOptions} from '@nestjs/typeorm' 

export const config: TypeOrmModuleOptions = {
    type:'postgres',
    port: 5432,
    host: '127.0.0.1',
    database:'test',
    username:'root',
    password:'root',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize:true,
};