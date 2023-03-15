import { PrismaService } from '../prisma/prisma.service';
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(): Promise<import(".prisma/client").User[]>;
}
