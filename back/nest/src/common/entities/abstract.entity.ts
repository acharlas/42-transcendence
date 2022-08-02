import { UtilsService } from "src/utils/services/utils.service";
import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { AbstractDto } from "../dtos/abstract.dto";

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    @PrimaryGeneratedColumn('uuid')
    public uuid: string;

    @CreateDateColumn()
    public createdAt: Date;

    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    toDto(options?: any): T {
        return UtilsService.toDto(this.dtoClass, this, options)
    }
}