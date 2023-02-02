export type Lobby = {
  id: string;
  playerOne: Player;
  playerTwo: Player;
  game: Game;
  invited: string[];
  viewer: string[];
};

export type Player = {
  id: string;
  mmr: number;
  nickname: string;
};

export type Playertab = {
  id: string;
  position: Position;
  ready: boolean;
  timer: number;
  pauseAt: Date;
};

export type Game = {
  start: boolean;
  player: Playertab[];
  score: number[];
  ball: Ball;
  paddleHeight: number;
  paddleWidth: number;
  ballRadius: number;
};

export type Ball = {
  position: Position;
  vector: Position;
};

export type Position = {
  x: number;
  y: number;
};

export var playerHeight = 0.21333333333333335;
export var playerWidth = 0.04;
export var ballRadius: 0.05333333333333334;
