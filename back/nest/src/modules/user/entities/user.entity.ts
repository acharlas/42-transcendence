import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { ChannelUsers } from '../../../entities/channelUsers.entity';
import { Message } from '../../../entities/message.entity';

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  INGAME = 'ingame',
  SPEC = 'spec',
}

@Entity({name: "users"})
export class UserEntity extends AbstractEntity {

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ONLINE })
  status: UserStatus;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @OneToMany(() => ChannelUsers, (channelUser) => channelUser.userRef)
  channels: ChannelUsers[];

  @OneToMany(() => Message, (message) => message.userRef)
  messages: Message[];

  @ManyToMany((type) => UserEntity)
  @JoinTable({ joinColumn: { name: 'id_1' } })
  friends: UserEntity[];

  @ManyToMany((type) => UserEntity)
  @JoinTable({ joinColumn: { name: 'id_1' } })
  blocked: UserEntity[];
}
