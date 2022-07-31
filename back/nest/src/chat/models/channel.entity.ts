import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("channel")
export class ChannelEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column()
    senderId: string;

    @Column({default: new Date()})
    timestamps: Date;


}