import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChannelI } from '../models/channel.interface';
import { ChannelService } from '../service/channel.service';

@Controller('channel')
export class ChannelController {

    constructor(private channelService: ChannelService) {}

    @Post()
    add(@Body() user: ChannelI): Observable<ChannelI> {
        return this.channelService.add(user);
    }

    @Get()
    findAll(): Observable<ChannelI[]> {
        return this.channelService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Observable<ChannelI> {
        return this.channelService.findById(id);
    }
   
}