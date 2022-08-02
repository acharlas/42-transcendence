import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { UserEntity } from '../modules/user/entities/user.entity';

export enum UserPrivilege {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  MUTED = 'muted',
  BAN = 'ban',
}

@Entity()
export class ChannelUsers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UserPrivilege, default: UserPrivilege.USER })
  privilege: UserPrivilege;

  @ManyToOne(() => Channel, (channel) => channel.users)
  channelRef: Channel;

  @ManyToOne(() => UserEntity, (user) => user.channels)
  userRef: UserEntity;
}
