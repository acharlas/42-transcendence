import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { UserEntity } from '../modules/user/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Channel, (channel) => channel.users)
  channelRef: Channel;

  @ManyToOne(() => UserEntity, (user) => user.channels)
  userRef: UserEntity;
}
