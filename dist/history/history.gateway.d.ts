import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
export declare class HistoryGateway {
    private readonly historyService;
    constructor(historyService: HistoryService);
    create(createHistoryDto: CreateHistoryDto): Promise<void>;
}
