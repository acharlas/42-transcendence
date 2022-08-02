import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    public uuid: string;

    @CreateDateColumn()
    public createdAt: Date;
}