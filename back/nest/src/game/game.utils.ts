import { Lobby, Position } from './types_game';

export const PlayerIsInLobby = (userId: string, lobby: Lobby) => {
  if (lobby && (lobby.playerOne === userId || lobby.playerTwo === userId)) return true;
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
  if (lobby.playerOne === userId) return 0;
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
    ballPos.x - ballRadius / 2 >= paddlePos.x - paddleWidth &&
    ballPos.y - ballRadius / 2 < paddlePos.y + paddleHeight &&
    ballPos.y + ballRadius / 2 > paddlePos.y - paddleHeight
  )
    return true;
  return false;
};

export const NormPos = (pos: Position): Position => {
  if (pos.x > 1) pos.x = 1;
  if (pos.x < 0) pos.x = 0;
  if (pos.y > 1) pos.y = 1;
  if (pos.y < 0) pos.y = 0;

  return pos;
};

export const BallOnPaddleTwo = (lobby: Lobby, ballPos: Position): boolean => {
  const paddlePos = lobby.game.player[1].position;
  const paddleHeight = lobby.game.paddleHeight;
  const paddleWidth = lobby.game.paddleWidth;
  const ballRadius = lobby.game.ballRadius;

  if (
    ballPos.x + ballRadius / 2 <= paddlePos.x + paddleWidth &&
    ballPos.y - ballRadius / 2 <= paddlePos.y + paddleHeight &&
    ballPos.y + ballRadius / 2 >= paddlePos.y - paddleHeight
  )
    return true;
  return false;
};

export const BallScore = (ballPos: Position) => {
  if (ballPos.x >= 0.98 || ballPos.x <= 0.03) return true;
  return false;
};

export const ballHitWall = (ballPos: Position): boolean => {
  if (ballPos.y >= 0.975 || ballPos.y <= 0.025) return true;
  return false;
};

export const RandSpeed = (speed: number): Position => {
  const speedX = Math.random() * (speed / 1.5 - -speed / 4) + -speed / 4;
  const speedY = Math.random() > 0.5 ? speed - speedX : (speed - speedX) * -1;
  return { x: speedX, y: speedY };
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
