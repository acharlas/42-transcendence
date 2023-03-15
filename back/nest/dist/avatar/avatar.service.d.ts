import { StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvatarPathDto } from './dto/avatar.dto';
export declare class AvatarService {
    private prisma;
    constructor(prisma: PrismaService);
    saveAvatar(userId: string, dto: AvatarPathDto): Promise<boolean>;
    deleteAvatar(userId: string): Promise<void>;
    getAvatar(targetId: string): Promise<StreamableFile>;
}
