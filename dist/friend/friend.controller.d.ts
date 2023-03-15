import { User } from '@prisma/client';
import { FriendDto } from './dto';
import { FriendService } from './friend.service';
export declare class FriendController {
    private friendService;
    constructor(friendService: FriendService);
    addFriend(userId: string, dto: FriendDto): Promise<{
        myfriend: User[];
    }>;
    removeFriend(userId: string, dto: FriendDto): Promise<{
        myfriend: User[];
    }>;
    getFriend(userId: string, id: string): Promise<{
        myfriend: User[];
    }>;
}
