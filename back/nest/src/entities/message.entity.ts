import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";


@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    content: string
    
    @CreateDateColumn()
    timestamp: Date

    @ManyToOne(() => Channel, (channel) => channel.users)
    channelRef: Channel

    @ManyToOne(() => User, (user) => user.channels)
    userRef: User
}