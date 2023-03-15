import { GameMode } from '@prisma/client';
export declare class CreateHistoryDto {
    mode: GameMode;
    score: {
        id: string;
        score: number;
        placement: number;
    }[];
}
