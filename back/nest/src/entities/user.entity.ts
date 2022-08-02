import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { ChannelUsers } from "./channelUsers.entity"
import { Message } from "./message.entity"

export enum UserStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
    INGAME = 'ingame',
    SPEC = 'spec'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    username: string

    @Column()
    nickname: string

    @Column({type: 'enum', enum: UserStatus, default: UserStatus.ONLINE})
    status: UserStatus

    @Column({default: 0})
    wins: number

    @Column({default: 0})
    losses: number

    @OneToMany(() => ChannelUsers, (channelUser) => channelUser.userRef)
    channels: ChannelUsers[]

    @OneToMany(() => Message, (message) => message.userRef)
    messages: Message[]

    @ManyToMany(type => User)
    @JoinTable({joinColumn: {name: 'id_1'} })
    friends: User[]

    @ManyToMany(type => User)
    @JoinTable({joinColumn: {name: 'id_1'} })
    blocked: User[]

}