import { Achievement, User, UserHistory } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): User;
    getUserId(userId: string, id: string): Promise<User>;
    getUsers(): Promise<User[]>;
    getUserHistory(userId: string): Promise<{
        history: UserHistory[];
    }>;
    getAchievement(userId: string): Promise<Achievement[]>;
    editUser(userId: string, dto: EditUserDto): Promise<User>;
}
