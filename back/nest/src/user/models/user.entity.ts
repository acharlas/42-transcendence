import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    nickname: string;

    @Column()
    ladderLevel: number;

    @Column({type: "simple-json", nullable: true})
    stats: {wins: number, losses: number}


}