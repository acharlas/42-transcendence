"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bounceAngle = exports.normalizedRelativeIntersectionY = exports.RelativeIntersectionY = exports.RandSpeed = exports.ballHitWall = exports.BallScore = exports.NormPos = exports.NoOOB = exports.BallOnPaddleTwo = exports.BallOnPaddleOne = exports.BallOnPaddle = exports.WitchPlayer = exports.LobbyIsReaddy = exports.PlayerIsReaddy = exports.PlayerIsInWatching = exports.PlayerIsInLobby = void 0;
const PlayerIsInLobby = (userId, lobby) => {
    if (lobby &&
        ((lobby.playerOne && lobby.playerOne.id === userId) || (lobby.playerTwo && lobby.playerTwo.id === userId)))
        return true;
    return false;
};
exports.PlayerIsInLobby = PlayerIsInLobby;
const PlayerIsInWatching = (userId, lobby) => {
    return (lobby &&
        lobby.viewer.find((viewer) => {
            if (viewer === userId)
                return true;
            return false;
        }));
};
exports.PlayerIsInWatching = PlayerIsInWatching;
const PlayerIsReaddy = (lobby) => {
    return (lobby &&
        lobby.game &&
        !lobby.game.player.find((player) => {
            return !player.ready;
        }));
};
exports.PlayerIsReaddy = PlayerIsReaddy;
const LobbyIsReaddy = (lobby) => {
    return lobby && lobby.playerOne && lobby.playerOne.readdy && lobby.playerTwo && lobby.playerTwo.readdy;
};
exports.LobbyIsReaddy = LobbyIsReaddy;
const WitchPlayer = (userId, lobby) => {
    if (lobby && lobby.playerOne && lobby.playerOne.id === userId)
        return 0;
    else
        return 1;
};
exports.WitchPlayer = WitchPlayer;
const BallOnPaddle = (lobby, ballPos) => {
    if ((0, exports.BallOnPaddleOne)(lobby, ballPos))
        return 0;
    if ((0, exports.BallOnPaddleTwo)(lobby, ballPos))
        return 1;
    return -1;
};
exports.BallOnPaddle = BallOnPaddle;
const BallOnPaddleOne = (lobby, ballPos) => {
    const paddlePos = lobby.game.player[0].position;
    const paddleHeight = lobby.game.paddleHeight;
    const paddleWidth = lobby.game.paddleWidth;
    const ballRadius = lobby.game.ballRadius;
    if (ballPos.x - ballRadius / 2 <= paddlePos.x + paddleWidth / 2 &&
        ballPos.y - ballRadius / 2 < paddlePos.y + paddleHeight / 2 &&
        ballPos.y + ballRadius / 2 > paddlePos.y - paddleHeight / 2)
        return true;
    return false;
};
exports.BallOnPaddleOne = BallOnPaddleOne;
const BallOnPaddleTwo = (lobby, ballPos) => {
    const paddlePos = lobby.game.player[1].position;
    const paddleHeight = lobby.game.paddleHeight;
    const paddleWidth = lobby.game.paddleWidth;
    const ballRadius = lobby.game.ballRadius;
    if (ballPos.x + ballRadius / 2 >= paddlePos.x - paddleWidth / 2 &&
        ballPos.y - ballRadius / 2 <= paddlePos.y + paddleHeight / 2 &&
        ballPos.y + ballRadius / 2 >= paddlePos.y - paddleHeight / 2)
        return true;
    return false;
};
exports.BallOnPaddleTwo = BallOnPaddleTwo;
const NoOOB = (pos, lobby) => {
    const ballRadius = lobby.game.ballRadius;
    if (pos.x + ballRadius >= 1)
        pos.x = 0.999999 - ballRadius;
    if (pos.x - ballRadius <= 0)
        pos.x = 0.000001 + ballRadius;
    if (pos.y + ballRadius >= 1)
        pos.y = 0.999999 - ballRadius;
    if (pos.y - ballRadius <= 0)
        pos.y = 0.000001 + ballRadius;
    return pos;
};
exports.NoOOB = NoOOB;
const NormPos = (pos) => {
    if (pos.x > 1)
        pos.x = 1;
    if (pos.x < 0)
        pos.x = 0;
    if (pos.y > 1)
        pos.y = 1;
    if (pos.y < 0)
        pos.y = 0;
    return pos;
};
exports.NormPos = NormPos;
const BallScore = (lobby, ballPos) => {
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
exports.BallScore = BallScore;
const ballHitWall = (lobby, ballPos) => {
    const ballRadius = lobby.game.ballRadius;
    if (ballPos.y + ballRadius / 2 >= 1 || ballPos.y - ballRadius / 2 <= 0)
        return true;
    return false;
};
exports.ballHitWall = ballHitWall;
const RandSpeed = (speed) => {
    const speedY = Math.random() * ((2 * speed) / 3 - speed / 3) + speed / 3;
    const speedX = Math.random() > 0.5 ? speed - speedY : (speed - speedY) * -1;
    return { x: speedX, y: Math.random() > 0.5 ? speedY : speedY * -1 };
};
exports.RandSpeed = RandSpeed;
const RelativeIntersectionY = (lobby, paddleY) => {
    return paddleY + lobby.game.paddleHeight / 2 - (lobby.game.ball.position.y - paddleY);
};
exports.RelativeIntersectionY = RelativeIntersectionY;
const normalizedRelativeIntersectionY = (lobby, paddleY) => {
    return (0, exports.RelativeIntersectionY)(lobby, paddleY) / (lobby.game.paddleHeight / 2);
};
exports.normalizedRelativeIntersectionY = normalizedRelativeIntersectionY;
const bounceAngle = (lobby, paddleY) => {
    return (0, exports.normalizedRelativeIntersectionY)(lobby, paddleY) * ((5 * Math.PI) / 12);
};
exports.bounceAngle = bounceAngle;
//# sourceMappingURL=game.utils.js.map