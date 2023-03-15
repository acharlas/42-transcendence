import { BlockDto } from './dto';
import { BlockService } from './block.service';
import { User } from '@prisma/client';
export declare class BlockController {
    private blockService;
    constructor(blockService: BlockService);
    addBlock(userId: string, dto: BlockDto): Promise<{
        myblock: User[];
    }>;
    removeBlock(userId: string, dto: BlockDto): Promise<{
        myblock: User[];
    }>;
    getblock(userId: string, id: string): Promise<{
        myblock: User[];
    }>;
}
