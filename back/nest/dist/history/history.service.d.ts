import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { updateRankingsDto } from './dto/update-rankings-dto';
import { HistoryMatch } from './types_history';
export declare class HistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    createhistory(createHistoryDto: CreateHistoryDto): Promise<void>;
    getHistoryId(historyId: string): Promise<import(".prisma/client").History & {
        user: import(".prisma/client").UserHistory[];
    }>;
    getUserHistory(userId: string): Promise<HistoryMatch[]>;
    editElo(userId: string, newMmr: number): Promise<void>;
    incrementWins(userId: string): Promise<void>;
    incrementLosses(userId: string): Promise<void>;
    getElo(userId: string): Promise<number>;
    updateRankings(gameData: updateRankingsDto): Promise<void>;
}
