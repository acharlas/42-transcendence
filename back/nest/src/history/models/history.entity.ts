import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("history")
export class HistoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-json")
    matchinfo : [
    {
        player:{
            name: string,
            score: number
        }    
    }
    ]



}