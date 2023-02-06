export interface Lobby {
  id: string;
  playerOne: { id: string; mmr: number; nickname: string; readdy: boolean };
  playerTwo: { id: string; mmr: number; nickname: string; readdy: boolean };
  game: Game;
  invited: string[];
  viewer: string[];
}

export type Game = {
  start: boolean;
  player: Player[];
  score: number[];
  mode: GameMode;
};

export enum GameMode {
  classic = "CLASSIC",
  battleRoyal = "BATTLEROYAL",
  ranked = "RANKED",
}

export enum Achievement {
  EasyWin = "EasyWin",
  HardLosse = "HardLosse",
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

export type history = {
  mode: GameMode;
  score: {
    id: string;
    nickName: string;
    score: number;
    placement: number;
  }[];
};

export type Player = {
  id: string;
  ready: boolean;
  Timer: number;
  pauseAt: Date;
};

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

export type Position = {
  x: number;
  y: number;
};
