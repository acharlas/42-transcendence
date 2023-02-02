import { Lobby, Position } from './types_game';

export const PlayerIsInLobby = (userId: string, lobby: Lobby) => {
  if (
    lobby &&
    ((lobby.playerOne && lobby.playerOne.id === userId) || (lobby.playerTwo && lobby.playerTwo.id === userId))
  )
    return true;
  return false;
};

export const PlayerIsInWatching = (userId: string, lobby: Lobby) => {
  return (
    lobby &&
    lobby.viewer.find((viewer) => {
      if (viewer === userId) return true;
      return false;
    })
  );
};

export const PlayerIsReaddy = (lobby: Lobby) => {
  return (
    lobby &&
    lobby.game &&
    !lobby.game.player.find((player) => {
      return !player.ready;
    })
  );
};

export const WitchPlayer = (userId: string, lobby: Lobby): number => {
  if (lobby.playerOne.id === userId) return 0;
  else return 1;
};

export const BallOnPaddle = (lobby: Lobby, ballPos: Position): number => {
  if (BallOnPaddleOne(lobby, ballPos)) return 0;
  if (BallOnPaddleTwo(lobby, ballPos)) return 1;
  return -1;
};

export const BallOnPaddleOne = (lobby: Lobby, ballPos: Position): boolean => {
  const paddlePos = lobby.game.player[0].position;
  const paddleHeight = lobby.game.paddleHeight;
  const paddleWidth = lobby.game.paddleWidth;
  const ballRadius = lobby.game.ballRadius;

  if (
    ballPos.x - ballRadius / 2 <= paddlePos.x + paddleWidth / 2 &&
    ballPos.y - ballRadius / 2 < paddlePos.y + paddleHeight / 2 &&
    ballPos.y + ballRadius / 2 > paddlePos.y - paddleHeight / 2
  )
    return true;
  return false;
};

export const BallOnPaddleTwo = (lobby: Lobby, ballPos: Position): boolean => {
  const paddlePos = lobby.game.player[1].position;
  const paddleHeight = lobby.game.paddleHeight;
  const paddleWidth = lobby.game.paddleWidth;
  const ballRadius = lobby.game.ballRadius;

  if (
    ballPos.x + ballRadius / 2 >= paddlePos.x - paddleWidth / 2 &&
    ballPos.y - ballRadius / 2 <= paddlePos.y + paddleHeight / 2 &&
    ballPos.y + ballRadius / 2 >= paddlePos.y - paddleHeight / 2
  )
    return true;
  return false;
};

export const NoOOB = (pos: Position, lobby: Lobby): Position => {
  const ballRadius = lobby.game.ballRadius;

  if (pos.x + ballRadius >= 1) pos.x = 0.999999 - ballRadius;
  if (pos.x - ballRadius <= 0) pos.x = 0.000001 + ballRadius;
  if (pos.y + ballRadius >= 1) pos.y = 0.999999 - ballRadius;
  if (pos.y - ballRadius <= 0) pos.y = 0.000001 + ballRadius;

  return pos;
};

export const NormPos = (pos: Position): Position => {
  if (pos.x > 1) pos.x = 1;
  if (pos.x < 0) pos.x = 0;
  if (pos.y > 1) pos.y = 1;
  if (pos.y < 0) pos.y = 0;

  return pos;
};

export const BallScore = (lobby: Lobby, ballPos: Position) => {
  const ballRadius = lobby.game.ballRadius;
  if (ballPos.x - ballRadius / 2 <= 0) {
    lobby.game.score[0]++;
    return true;
  }
  if (ballPos.x + ballRadius / 2 >= 1) {
    lobby.game.score[1]++;
    return true;
  }
  return false;
};

export const ballHitWall = (lobby: Lobby, ballPos: Position): boolean => {
  const ballRadius = lobby.game.ballRadius;

  if (ballPos.y + ballRadius / 2 >= 1 || ballPos.y - ballRadius / 2 <= 0) return true;
  return false;
};

export const RandSpeed = (speed: number): Position => {
  const speedY = Math.random() * ((2 * speed) / 3 - speed / 3) + speed / 3;
  const speedX = Math.random() > 0.5 ? speed - speedY : (speed - speedY) * -1;
  return { x: speedX, y: Math.random() > 0.5 ? speedY : speedY * -1 };
};

export const RelativeIntersectionY = (lobby: Lobby, paddleY: number): number => {
  return paddleY + lobby.game.paddleHeight / 2 - (lobby.game.ball.position.y - paddleY);
};

export const normalizedRelativeIntersectionY = (lobby: Lobby, paddleY: number): number => {
  return RelativeIntersectionY(lobby, paddleY) / (lobby.game.paddleHeight / 2);
};

export const bounceAngle = (lobby: Lobby, paddleY: number): number => {
  return normalizedRelativeIntersectionY(lobby, paddleY) * ((5 * Math.PI) / 12);
};
