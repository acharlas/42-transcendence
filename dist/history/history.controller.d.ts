import { HistoryService } from './history.service';
import { HistoryMatch } from './types_history';
export declare class HistoryController {
    private historyService;
    constructor(historyService: HistoryService);
    getUserHistory(userId: string): Promise<HistoryMatch[]>;
}
