import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HistoryI } from '../models/history.interface';
import { HistoryService } from '../service/history.service';

@Controller('history')
export class HistoryController {

    constructor(private historyService: HistoryService) {}

    @Post()
    add(@Body() user: HistoryI): Observable<HistoryI> {
        return this.historyService.add(user);
    }

    @Get()
    findAll(): Observable<HistoryI[]> {
        return this.historyService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: number): Observable<HistoryI> {
        return this.historyService.findById(id);
    }
   
}