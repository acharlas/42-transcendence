import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("channel")
export class ChannelEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-json")
    messages: [{
        userid: number,
        timestamp: string,
        content: string
    }]



}