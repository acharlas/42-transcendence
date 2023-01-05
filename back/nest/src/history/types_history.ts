import { GameMode } from '@prisma/client';

export type UserScore = {
  id: string;
  userName: string;
  score: number;
  placement: number;
};

export type HistoryMatch = {
  gameMode: GameMode;
  player: UserScore[];
};
