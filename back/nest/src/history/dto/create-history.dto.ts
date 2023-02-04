import { GameMode } from '@prisma/client';

export class CreateHistoryDto {
  mode: GameMode;
  score: {
    id: string;
    score: number;
    placement: number;
  }[];
}
