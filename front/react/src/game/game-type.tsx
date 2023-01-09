export interface Lobby {
  id: string;
  playerOne: string;
  playerTwo: string;
  score: number[];
}

export enum GameMode {
  classic = "CLASSIC",
  battleRoyal = "BATTLEROYAL",
}

export class CreateHistoryDto {
  mode: GameMode;
  score: [
    {
      id: string;
      score: number;
      placement: number;
    }
  ];
}

export type UserScore = {
  id: string;
  userName: string;
  score: number;
  placement: number;
};

export type HistoryMatch = {
  date: Date;
  gameMode: GameMode;
  player: UserScore[];
};
