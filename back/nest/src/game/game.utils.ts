import { Lobby } from './types_game';

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

export const BallOnPaddle = (lobby: Lobby): number => {
  if (BallOnPaddleOne(lobby)) return 0;
  if (BallOnPaddleTwo(lobby)) return 1;
  return -1;
};

export const BallOnPaddleOne = (lobby: Lobby): boolean => {
  const ballPos = lobby.game.ball.position;
  const paddlePos = lobby.game.player[0].position;
  const paddleHeight = lobby.game.paddleHeight;
  const paddleWidth = lobby.game.paddleWidth;
  const ballRadius = lobby.game.ballRadius;

  if (
    ballPos.x - ballRadius / 2 <=
    paddlePos.x + paddleWidth / 2
    // &&
    // ballPos.y - ballRadius / 2 < paddlePos.y + paddleHeight / 2 &&
    // ballPos.y + ballRadius / 2 > paddlePos.y - paddleHeight / 2
  )
    return true;
  return false;
};

export const BallOnPaddleTwo = (lobby: Lobby): boolean => {
  const ballPos = lobby.game.ball.position;
  const paddlePos = lobby.game.player[1].position;
  const paddleHeight = lobby.game.paddleHeight;
  const paddleWidth = lobby.game.paddleWidth;
  const ballRadius = lobby.game.ballRadius;

  if (
    ballPos.x + ballRadius / 2 >=
    paddlePos.x - paddleWidth / 2
    // &&
    // ballPos.y - ballRadius / 2 <= paddlePos.y + paddleHeight / 2 &&
    // ballPos.y + ballRadius / 2 >= paddlePos.y - paddleHeight / 2
  )
    return true;
  return false;
};

export const BallScore = (lobby: Lobby) => {
  return false;
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
