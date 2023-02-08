import { ForbiddenException, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { GameMode } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ballAlpha, ballMomentumStart, BallSpeed, MaxBallXVelocity } from './const';
import {
  PlayerIsInWatching,
  PlayerIsInLobby,
  BallOnPaddle,
  BallScore,
  WitchPlayer,
  ballHitWall,
  RandSpeed,
  NormPos,
  LobbyIsReaddy,
} from './game.utils';
import { Lobby, Player, Position } from './types_game';

@Injectable()
export class GameService {
  constructor(private schedulerRegistry: SchedulerRegistry, private userService: UserService) {
    console.log('gameservice instance created');
  }

  LobbyList: Lobby[] = [];
  Queue: Player[] = [];
  Speed: number = 0.0000666666;

  /*==================Queue===========================*/
  async JoiningQueue(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('actual queue: ', this.Queue);
      this.CreatePlayer(userId)
        .then((newPlayer) => {
          const find = this.Queue.find((player) => {
            if (player.id === newPlayer.id) return true;
            return false;
          });
          if (!find) this.Queue.push(newPlayer);
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async LeavingQueue(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.Queue = this.Queue.filter((player) => {
        if (player.id === userId) return false;
        return false;
      });
      return resolve();
    });
  }
  /*=============================================*/

  /*==================Lobby===========================*/

  async CreateLobby(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      this.userService
        .getUserId(userId, userId)
        .then((user) => {
          return resolve(
            new Promise<Lobby>((resolve, reject) => {
              const lobby = {
                id: userId,
                playerOne: { id: userId, mmr: user.mmr, nickname: user.nickname, readdy: true },
                playerTwo: null,
                game: null,
                invited: [],
                viewer: [],
              };
              this.LeaveLobby(userId)
                .then(() => {
                  const find = this.LobbyList.find((lobbyL) => {
                    if (lobbyL.id === lobby.id) return true;
                    return false;
                  });
                  if (find) return reject(new ForbiddenException('lobby already create'));
                  this.LobbyList.push(lobby); //this.LobbyList = [...this.LobbyList, lobby];
                  return resolve(lobby);
                })
                .catch((err) => {
                  return reject(err);
                });
            }),
          );
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async AddInvite(lobbyId: string, inviteId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        if (lobby.id === lobbyId) return true;
        return false;
      });
      if (!lobby) return reject(new ForbiddenException('no such lobby'));
      if (
        lobby.invited.find((user) => {
          if (user === inviteId) return true;
          return false;
        })
      )
        return reject(new ForbiddenException('user already invite'));
      lobby.invited.push(inviteId);
      return resolve(lobby);
    });
  }

  async LeaveLobby(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (lobby) {
        if (lobby.playerOne.id === userId) {
          if (lobby.playerTwo === null) {
            this.LobbyList = this.LobbyList.filter((lobby) => {
              if (lobby.playerOne.id === userId) return false;
              return true;
            });
            return resolve(lobby);
          } else {
            lobby.playerOne = { ...lobby.playerTwo, readdy: true };
            lobby.playerTwo = null;
            return resolve(lobby);
          }
        } else {
          lobby.playerTwo = null;
          return resolve(lobby);
        }
      }
      const lobbyViewer = this.LobbyList.find((lobby) => {
        return PlayerIsInWatching(userId, lobby);
      });
      if (lobbyViewer) {
        lobbyViewer.viewer = lobbyViewer.viewer.filter((user) => {
          if (user === userId) return false;
          return true;
        });
        if (lobby.game) this.schedulerRegistry.deleteInterval(lobby.id);
        return resolve(lobbyViewer);
      }
      return resolve(null);
    });
  }

  async CreatePlayer(userId: string): Promise<Player> {
    return new Promise<Player>((resolve, reject) => {
      this.userService
        .getUserId(userId, userId)
        .then((user) => {
          return resolve({ id: userId, mmr: user.mmr, nickname: user.nickname, readdy: false });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async JoinLobby(userId: string, lobbyId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const actLobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (actLobby) {
        return reject(new ForbiddenException('already in a room'));
      }
      const joinLobby = this.LobbyList.find((lobby) => {
        if (lobby.id === lobbyId) return true;
        return false;
      });
      if (!joinLobby) return reject(new ForbiddenException('no such lobby'));
      if (joinLobby.playerTwo) return reject(new ForbiddenException('lobby is full'));
      return resolve(
        new Promise<Lobby>((resolve, reject) => {
          this.CreatePlayer(userId)
            .then((player) => {
              joinLobby.playerTwo = player;
              joinLobby.invited = joinLobby.invited.filter((user) => {
                if (user === userId) return false;
                return true;
              });
              return resolve(joinLobby);
            })
            .catch((err) => {
              return reject(err);
            });
        }),
      );
    });
  }

  async PlayerDisconnect(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const oldLobby = {
        ...this.LobbyList.find((lobby) => {
          return PlayerIsInLobby(userId, lobby);
        }),
      };
      this.LeaveLobby(userId)
        .then((lobby) => {
          if (lobby) {
            return resolve(oldLobby);
          }
          return resolve(null);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async FindPLayerLobby(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      return resolve(
        this.LobbyList.find((lobby) => {
          return PlayerIsInLobby(userId, lobby) || PlayerIsInWatching(userId, lobby);
        }),
      );
    });
  }

  async JoinViewer(userId: string, lobbyId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        if (lobby.id === lobbyId) return true;
        return false;
      });
      if (!lobby) return reject(new ForbiddenException('no such lobby'));
      if (
        lobby.viewer.find((viewer) => {
          if (viewer === userId) return true;
          return false;
        })
      )
        return reject(new ForbiddenException('already in the lobby'));
      if (
        this.LobbyList.find((lobby) => {
          return PlayerIsInLobby(userId, lobby);
        })
      )
        return resolve(
          new Promise<Lobby>((resolve, reject) => {
            this.LeaveLobby(userId)
              .then(() => {
                lobby.viewer.push(userId);
                return resolve(lobby);
              })
              .catch((err) => {
                return reject(err);
              });
          }),
        );
      lobby.viewer.push(userId);
      return resolve(lobby);
    });
  }

  async PlayerLobbyReaddy(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException('no lobby found'));
      if (lobby.playerOne.id === userId) return reject(new ForbiddenException('player is player one'));
      lobby.playerTwo.readdy = !lobby.playerTwo.readdy;
      return resolve(lobby);
    });
  }
  /*=============================================*/

  /*==================ingameList======================*/
  ingameList: string[] = [];

  //add players to ingame list
  async incIngameList(newLobby: Lobby) {
    // console.log("inc");
    this.ingameList.push(newLobby.playerOne.id);
    this.ingameList.push(newLobby.playerTwo.id);
    // console.log(this.ingameList);
  }

  //rm players from ingame list
  async decIngameList(idOne, idTwo) {
    // console.log("dec");
    this.ingameList = this.ingameList.filter(function (element, index, array) {
      return element !== idOne && element !== idTwo;
    });
    // console.log(this.ingameList);
  }

  async isPlaying(userId: string) {
    // console.log(this.ingameList);
    // console.log("tried:", userId);
    return this.ingameList.includes(userId);
  }
  /*==================================================*/

  /*==================matchmaking===========================*/
  async MatchPlayer(): Promise<Lobby[]> {
    let n = 0;
    const newLobby: Lobby[] = [];

    // console.log('queue: ', this.Queue);
    return new Promise<Lobby[]>((resolve, reject) => {
      while (n < this.Queue.length) {
        const playerOne = this.Queue[n];
        const playerTwo = this.Queue.find((playerTwo) => {
          // if (playerTwo.mmr === playerOne.mmr && playerOne.id !== playerTwo.id) return true;
          if (playerOne.id !== playerTwo.id) return true;
          return false;
        });
        if (playerTwo) {
          const lobby = {
            id: playerOne.id + playerTwo.id,
            playerOne: { ...playerOne, readdy: true },
            playerTwo: { ...playerTwo, readdy: true },
            game: null,
            invited: [],
            viewer: [],
          };
          this.LobbyList = [...this.LobbyList, lobby];
          this.Queue = this.Queue.filter((player) => {
            if (player.id !== playerOne.id && player.id !== playerTwo.id) return true;
            return false;
          });
          newLobby.push(lobby);
        } else n++;
      }
      return resolve(newLobby);
    });
  }
  /*=============================================*/

  /*==================Game===========================*/
  async UpdatePlayerPos(userId: string, position: number): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException("user isn't in a lobby"));
      lobby.game.player[WitchPlayer(userId, lobby)].position.y = position;
      return resolve(lobby);
    });
  }

  async CreateGame(userId: string, gameMode: GameMode): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException("user isn't in a lobby"));
      if (!lobby.playerOne || !lobby.playerTwo) return reject(new ForbiddenException('missing player'));
      if (!LobbyIsReaddy(lobby)) return reject(new ForbiddenException('lobby is not readdy'));
      lobby.game = {
        start: false,
        player: [
          { id: lobby.playerOne.id, ready: false, pauseAt: null, timer: 60000, position: { x: 0, y: 0.5 } },
          { id: lobby.playerTwo.id, ready: false, pauseAt: null, timer: 60000, position: { x: 0, y: 0.5 } },
        ],
        mode: gameMode,
        paddleHeight: 0,
        paddleWidth: 0,
        ballRadius: 0,
        score: [0, 0],
        ball: { position: { x: 0.5, y: 0.5 }, vector: RandSpeed(this.Speed) },
        ballMomentum: ballMomentumStart,
        fun: false,
      };
      this.incIngameList(lobby);
      return resolve(lobby);
    });
  }

  async SetGameStart(lobbyId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        if (lobby.id === lobbyId) return true;
        return false;
      });
      if (!lobby) return reject(new ForbiddenException("lobby doesn't exist"));
      lobby.game = { ...lobby.game, start: true };
      return resolve(lobby);
    });
  }

  async PlayerReady(
    userId: string,
    paddleHeight: number,
    paddleWidth: number,
    ballRadius: number,
    position: number,
  ): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      lobby.game.paddleHeight = paddleHeight;
      lobby.game.paddleWidth = paddleWidth;
      lobby.game.ballRadius = ballRadius;
      lobby.game.player[WitchPlayer(userId, lobby)].position.x = position;
      lobby.game.player[WitchPlayer(userId, lobby)].ready = true;
      return resolve(lobby);
    });
  }

  async EndGame(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      lobby.game = null;
      return resolve(lobby);
    });
  }

  async UpdateBall(lobbyId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return lobby.id === lobbyId;
      });
      if (!lobby) return reject(new ForbiddenException('no lobby'));
      let nextPos: Position;
      nextPos = {
        x: lobby.game.ball.position.x + lobby.game.ball.vector.x * BallSpeed,
        y: lobby.game.ball.position.y + lobby.game.ball.vector.y * BallSpeed,
      };
      nextPos = NormPos(nextPos);
      const bounce = BallOnPaddle(lobby, nextPos);
      if (bounce >= 0) {
        // console.log(
        //   'bounce!!!!!!!!!!!!!!!!!!!!!!!',
        //   bounce,
        //   lobby.game.player[bounce].position.x,
        //   lobby.game.ball.position.x,
        //   lobby.game.ballRadius,
        // );
        // if (bounce === 0) {
        //   const angle = bounceAngle(lobby, lobby.game.player[bounce].position.y);
        //   lobby.game.ball.vector.x = this.Speed * Math.cos(angle);
        //   lobby.game.ball.vector.y = this.Speed * -Math.sin(angle);
        // } else {
        //   const angle = bounceAngle(lobby, lobby.game.player[bounce].position.y);
        //   lobby.game.ball.vector.x = this.Speed * Math.cos(angle);
        //   lobby.game.ball.vector.y = this.Speed * -Math.sin(angle);
        // }
        lobby.game.ball.vector.x = Math.min(lobby.game.ball.vector.x * lobby.game.ballMomentum, MaxBallXVelocity) * -1;

        //console.log('bounce');
        if (bounce === 1)
          lobby.game.ball.position.x =
            lobby.game.player[1].position.x - lobby.game.paddleWidth / 2 - lobby.game.ballRadius / 2;
        else
          lobby.game.ball.position.x =
            lobby.game.player[0].position.x + lobby.game.paddleWidth / 2 + lobby.game.ballRadius / 2;
        lobby.game.ball.position.y = nextPos.y;
        // lobby.game.ball.position.x =
        //   bounce === 1
        //     ? lobby.game.player[bounce].position.x + lobby.game.paddleWidth / 2 + lobby.game.ballRadius
        //     : lobby.game.player[bounce].position.x - lobby.game.paddleWidth / 2 - lobby.game.ballRadius;
        // lobby.game.ball.position.y = nextPos.y;
      } else if (BallScore(lobby, nextPos)) {
        // console.log(
        //   'ball score',
        //   lobby.game.player[0].position,
        //   lobby.game.player[1].position,
        //   lobby.game.ball.position,
        // );
        //lobby.game.ball.position = { x: 0.5, y: 0.5 };
        //nextPos = NoOOB(nextPos, lobby);
        lobby.game.ball.vector.x = RandSpeed(this.Speed).x * -1;
        lobby.game.ball.position = { x: 0.5, y: 0.5 };
        //lobby.game.ball.position = { ...nextPos };
        //console.log('vitesse score', lobby.game.ball.vector.x);
      } else if (ballHitWall(lobby, nextPos)) {
        // console.log(
        //   'ball hit the wall',
        //   lobby.game.player[0].position,
        //   lobby.game.player[1].position,
        //   lobby.game.ball.position,
        // );
        //nextPos = NoOOB(nextPos, lobby);
        const temp = lobby.game.ball.vector.x;
        lobby.game.ball.vector.x =
          Math.cos(ballAlpha) * lobby.game.ball.vector.x - Math.sin(ballAlpha) * lobby.game.ball.vector.y;
        lobby.game.ball.vector.y = Math.sin(ballAlpha) * temp + Math.cos(ballAlpha) * lobby.game.ball.vector.y;
        lobby.game.ball.vector.y = lobby.game.ball.vector.y * -1;
        //lobby.game.ball.position = { ...nextPos };
        //console.log('vitesse', lobby.game.ball.vector.y);
      } else {
        //nextPos = NoOOB(nextPos, lobby);
        lobby.game.ball.position = { ...nextPos };
      }

      return resolve(lobby);
    });
  }
  /*=============================================*/
}
