import { ForbiddenException, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameGateway } from './game.gateway';
import { PlayerIsInWatching, PlayerIsInLobby, BallOnPaddle, BallScore, bounceAngle, WitchPlayer } from './game.utils';
import { Game, Lobby, Player, playerHeight, Position } from './types_game';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private schedulerRegistry: SchedulerRegistry) {}

  LobbyList: Lobby[] = [];
  Queue: Player[] = [];
  Speed: number = 0.00003333333;

  /*==================Queue===========================*/
  async JoiningQueue(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('actual queue: ', this.Queue);
      const newPlayer = { id: userId, mmr: 0 };
      const find = this.Queue.find((player) => {
        if (player.id === newPlayer.id) return true;
        return false;
      });
      if (!find) this.Queue.push(newPlayer); //this.Queue = [...this.Queue, newPlayer]
      return resolve();
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
      const lobby = {
        id: userId,
        playerOne: userId,
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
        if (lobby.playerOne === userId) {
          if (lobby.playerTwo === null) {
            this.LobbyList = this.LobbyList.filter((lobby) => {
              if (lobby.playerOne === userId) return false;
              return true;
            });
            return resolve(lobby);
          } else {
            lobby.playerOne = lobby.playerTwo;
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

  async JoinLobby(userId: string, lobbyId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const actLobby = this.LobbyList.find((lobby) => {
        if (lobby.playerOne === userId || lobby.playerTwo === userId) return true;
        return false;
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
      joinLobby.playerTwo = userId;
      joinLobby.invited = joinLobby.invited.filter((user) => {
        if (user === userId) return false;
        return true;
      });
      return resolve(joinLobby);
    });
  }

  async PlayerDisconnect(userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.LeaveLobby(userId)
        .then((lobby) => {
          if (lobby) return resolve(lobby.id);
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
  /*=============================================*/

  /*==================matchmaking===========================*/
  async MatchPlayer(): Promise<Lobby[]> {
    let n = 0;
    const newLobby: Lobby[] = [];

    // console.log('queue: ', this.Queue);
    return new Promise<Lobby[]>((resolve, reject) => {
      while (n < this.Queue.length) {
        const playerOne = this.Queue[n];
        const playerTwo = this.Queue.find((playerTwo) => {
          if (playerTwo.mmr === playerOne.mmr && playerOne.id !== playerTwo.id) return true;
          return false;
        });
        if (playerTwo) {
          const lobby = {
            id: playerOne.id + playerTwo.id,
            playerOne: playerOne.id,
            playerTwo: playerTwo.id,
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
  async UpdatePlayerPos(userId: string, position: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException("user isn't in a lobby"));
      lobby.game.player[WitchPlayer(userId, lobby)].position.x = position;
      return resolve();
    });
  }

  async CreateGame(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException("user isn't in a lobby"));
      if (!lobby.playerOne || !lobby.playerTwo) return reject(new ForbiddenException('missing player'));
      lobby.game = {
        start: false,
        player: [
          { id: lobby.playerOne, ready: false, pauseAt: null, timer: 60000, position: { x: 0, y: 0.5 } },
          { id: lobby.playerTwo, ready: false, pauseAt: null, timer: 60000, position: { x: 0, y: 0.5 } },
        ],
        paddleHeight: 0,
        paddleWidth: 0,
        ballRadius: 0,
        score: [0, 0],
        ball: { position: { x: 0.5, y: 0.5 }, vector: { x: this.Speed, y: 0 } },
      };
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

  async SetLobbyPause(userId: string, callback: () => void): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException('no lobby'));

      if (lobby.playerOne === userId && !lobby.game.player[0].pauseAt) {
        const timeout = setTimeout(callback, lobby.game.player[0].timer);
        console.log('userId: ', userId, '  ', lobby.game.player[0].timer);
        lobby.game.player[0].pauseAt = new Date();
        this.schedulerRegistry.addTimeout(lobby.game.player[0].id, timeout);
        // lobby.game.player[0].pauseAt.setSeconds(lobby.game.player[0].pauseAt.getSeconds() + lobby.game.player[0].timer);
      }
      if (lobby.playerTwo === userId && !lobby.game.player[0].pauseAt) {
        const timeout = setTimeout(callback, lobby.game.player[1].timer);
        console.log('userId: ', userId, '  ', lobby.game.player[1].timer);
        lobby.game.player[1].pauseAt = new Date();
        this.schedulerRegistry.addTimeout(lobby.game.player[1].id, timeout);
        // lobby.game.player[0].pauseAt.setSeconds(lobby.game.player[0].pauseAt.getSeconds() + lobby.game.player[0].timer);
      }
      return resolve(lobby);
    });
  }

  async SetLobbyResume(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby) return reject(new ForbiddenException('no lobby'));
      if (lobby.playerOne === userId && lobby.game.player[0].pauseAt) {
        this.schedulerRegistry.deleteTimeout(lobby.game.player[0].id);
        const date = new Date();
        console.log(
          'time: ',
          'time: ',
          lobby.game.player[0].timer,
          '  ',
          lobby.game.player[0].pauseAt.getTime(),
          '  ',
          date.getTime(),
          '  ',
          date.getTime() - lobby.game.player[0].pauseAt.getTime(),
        );
        lobby.game.player[0].timer =
          lobby.game.player[0].timer - (date.getTime() - lobby.game.player[0].pauseAt.getTime());
        lobby.game.player[0].pauseAt = null;
      }
      if (lobby.playerTwo === userId && lobby.game.player[1].pauseAt) {
        const date = new Date();
        this.schedulerRegistry.deleteTimeout(lobby.game.player[1].id);
        console.log(
          'time: ',
          lobby.game.player[1].timer,
          '  ',
          lobby.game.player[1].pauseAt.getTime(),
          '  ',
          date.getTime(),
        );
        lobby.game.player[1].timer =
          lobby.game.player[1].timer - date.getTime() - lobby.game.player[1].pauseAt.getTime();
        lobby.game.player[1].pauseAt = null;
      }
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
      const bounce = BallOnPaddle(lobby);
      if (bounce >= 0) {
        console.log('bounce!!!!!!!!!!!!!!!!!!!!!!!', bounce, lobby.game.player[bounce].position.x);
        const angle = bounceAngle(lobby, lobby.game.player[bounce].position.y);
        lobby.game.ball.vector.x = this.Speed * Math.cos(angle);
        lobby.game.ball.vector.y = this.Speed * -Math.sin(angle);
      } else if (BallScore(lobby)) {
      }
      lobby.game.ball.position.x += lobby.game.ball.vector.x * 60;
      lobby.game.ball.position.y += lobby.game.ball.vector.y * 60;
      return resolve(lobby);
    });
  }
  /*=============================================*/
}
