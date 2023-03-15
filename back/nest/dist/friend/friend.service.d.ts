import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FriendDto } from './dto';
export declare class FriendService {
    private prisma;
    constructor(prisma: PrismaService);
    addFriend(userId: string, dto: FriendDto): Promise<{
        myfriend: User[];
    }>;
    removeFriend(userId: string, dto: FriendDto): Promise<{
        myfriend: User[];
    }>;
    getFriend(userId: string, id: string): Promise<{
        myfriend: User[];
    }>;
    getFriendList(userId: string): Promise<{
        username: string;
        nickname: string;
        id: string;
    }[]>;
}
