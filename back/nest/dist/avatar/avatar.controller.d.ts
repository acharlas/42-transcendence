/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { AvatarService } from './avatar.service';
export declare class AvatarController {
    private avatarService;
    constructor(avatarService: AvatarService);
    postAvatar(userId: string, avatar: Express.Multer.File): void;
    deleteAvatar(userId: string): void;
    getAvatar(targetId: string, res: Response): Promise<StreamableFile>;
}
