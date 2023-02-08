import { GameMode } from '@prisma/client';

export type Lobby = {
  id: string;
  playerOne: Player;
  playerTwo: Player;
  game: Game;
  mode: GameMode;
  invited: string[];
  viewer: string[];
};

export type Player = {
  id: string;
  mmr: number;
  nickname: string;
  readdy: boolean;
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
  ballMomentum: number;
};

export type Ball = {
  position: Position;
  vector: Position;
};

export type Position = {
  x: number;
  y: number;
};
