import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../models/channel.entity';
import { ChannelI } from '../models/channel.interface';

@Injectable()
export class ChannelService {

    constructor(
        @InjectRepository(ChannelEntity)
        private channelRepository: Repository<ChannelEntity>
    ) {}

    add(channel: ChannelI): Observable<ChannelI> {
        return from(this.channelRepository.save(channel));
    }

    findAll(): Observable<ChannelI[]> {
        return from(this.channelRepository.find());
    }

    findById(id: string): Observable<ChannelI> {
        return from(this.channelRepository.findOne({where: {id: id}}));
    }

}