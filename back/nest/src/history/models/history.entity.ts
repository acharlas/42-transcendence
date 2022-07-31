import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("history")
export class HistoryEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

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