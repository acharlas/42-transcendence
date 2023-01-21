export type Lobby = {
  id: string;
  playerOne: string;
  playerTwo: string;
  game: Game;
  invited: string[];
  viewer: string[];
};

export type Player = {
  id: string;
  mmr: number;
};

export type Game = {
  start: boolean;
  player: { id: string; readdy: boolean }[];
  score: number[];
};

export type Position = {
  x: number;
  y: number;
};

export var playerHeight = 0.21333333333333335;
export var playerWidth = 0.04;
export var ballRadius: 0.05333333333333334;
