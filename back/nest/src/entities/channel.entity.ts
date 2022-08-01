import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm"
import { ChannelUsers } from "./channelUsers.entity"

export enum ChannelType {
    PRIVATE = 'private',
    PUBLIC = 'public',
    PROTECTED = 'protected',
    DM = 'dm'
}

@Entity()
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({type: 'enum', enum: ChannelType, default: ChannelType.PUBLIC})
    type: ChannelType

    @Column({nullable: true})
    password: string

    @OneToMany(() => ChannelUsers, (channelUser) => channelUser.channelRef)
    users: ChannelUsers[]

    
    
    
}