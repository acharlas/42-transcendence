import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: ''})
    username: string;

    @Column({default: ''})
    nickname: string;

    @Column({default: 0})
    ladderLevel: number;

    @Column({type: "simple-json", nullable: true, default: {wins:0, losses: 0}})
    stats: {wins: number, losses: number}


}