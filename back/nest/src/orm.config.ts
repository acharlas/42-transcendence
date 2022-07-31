import {TypeOrmModuleOptions} from '@nestjs/typeorm' 

export const config: TypeOrmModuleOptions = {
    type:'postgres',
    port: 5432,
    host: 'postgres',
    database:'postgres',
    username:'postgres',
    password:'postgres',
    entities: ['dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize:true,
};