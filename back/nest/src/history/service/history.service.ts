import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { HistoryEntity } from '../models/history.entity';
import { HistoryI } from '../models/history.interface';

@Injectable()
export class HistoryService {

    constructor(
        @InjectRepository(HistoryEntity)
        private historyRepository: Repository<HistoryEntity>
    ) {}

    add(history: HistoryI): Observable<HistoryI> {
        return from(this.historyRepository.save(history));
    }

    findAll(): Observable<HistoryI[]> {
        return from(this.historyRepository.find());
    }

    findById(id: number): Observable<HistoryI> {
        return from(this.historyRepository.findOne({where: {id}}));
    }

}