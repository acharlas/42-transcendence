import { Achievement, User, UserHistory } from '@prisma/client';
import { Playertab } from 'src/game/types_game';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserId(userId: string, id: string): Promise<User>;
    getUsers(): Promise<User[]>;
    getUserUsername(id: string): Promise<User>;
    editUser(userId: string, dto: EditUserDto): Promise<User>;
    getHistory(UserId: string): Promise<{
        history: UserHistory[];
    }>;
    getUser(nickname: string): Promise<User>;
    GetAchievement(userId: string): Promise<Achievement[]>;
    AddAchievement(userId: string, achievement: Achievement): Promise<Achievement[]>;
    AchievementUpdate(player: Playertab[], score: number[]): Promise<void>;
}
