import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockDto } from './dto';
export declare class BlockService {
    private prisma;
    constructor(prisma: PrismaService);
    addBlock(userId: string, dto: BlockDto): Promise<{
        myblock: User[];
    }>;
    removeBlock(userId: string, dto: BlockDto): Promise<{
        myblock: User[];
    }>;
    getBlock(userId: string, id: string): Promise<{
        myblock: User[];
    }>;
    getBlockList(userId: string): Promise<{
        username: string;
        nickname: string;
    }[]>;
}
