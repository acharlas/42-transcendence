import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import PlayerIsInLobby from './game.utils';
import { Game, Lobby, Player } from './types_game';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  LobbyList: Lobby[] = [];
  Queue: Player[] = [];

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
      };
      this.LobbyList.push(lobby); //this.LobbyList = [...this.LobbyList, lobby];
      return resolve(lobby);
    });
  }

  async LeaveLobby(userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        console.log('LeaveLobby :', { lobby });
        if (lobby && (lobby.playerOne === userId || lobby.playerTwo === userId))
          return true;
        return false;
      });
      if (!lobby)
        return reject(new ForbiddenException("user isn't in a lobby"));

      if (lobby.playerOne === userId) {
        if (lobby.playerTwo === null)
          this.LobbyList = this.LobbyList.filter((lobby) => {
            if (lobby.playerOne === userId) return false;
            return true;
          });
        else {
          lobby.playerOne = lobby.playerTwo;
          lobby.playerTwo = null;
        }
      } else if (lobby.playerTwo === userId) {
        lobby.playerTwo === null;
      }
      return resolve(lobby.id);
    });
  }

  async JoinLobby(userId: string, lobbyId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const actLobby = this.LobbyList.find((lobby) => {
        if (lobby.playerOne === userId || lobby.playerTwo === userId)
          return true;
        return false;
      });
      if (actLobby) {
        reject(new ForbiddenException('already in a room'));
      }
      const joinLobby = this.LobbyList.find((lobby) => {
        if (lobby.id === lobbyId) return true;
        return false;
      });
      if (!joinLobby) reject(new ForbiddenException('no such lobby'));
      if (joinLobby.playerTwo) reject(new ForbiddenException('lobby is full'));
      this.LobbyList = this.LobbyList.map((lobby) => {
        if (lobby.id === lobbyId) return { ...lobby, playerTwo: userId };
        return lobby;
      });
      return resolve({ ...joinLobby, playerTwo: userId });
    });
  }

  async PlayerDisconnect(userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const lobbyFind = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (lobbyFind)
        this.LeaveLobby(userId)
          .then((lobbyId) => {
            return resolve(lobbyId);
          })
          .catch((err) => {
            return reject(err);
          });
      else return resolve(null);
    });
  }

  async FindPLayerLobby(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      return resolve(
        this.LobbyList.find((lobby) => {
          return PlayerIsInLobby(userId, lobby);
        }),
      );
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
          if (playerTwo.mmr === playerOne.mmr && playerOne.id !== playerTwo.id)
            return true;
          return false;
        });
        if (playerTwo) {
          const lobby = {
            id: playerOne.id + playerTwo.id,
            playerOne: playerOne.id,
            playerTwo: playerTwo.id,
            game: null,
          };
          this.LobbyList = [...this.LobbyList, lobby];
          this.Queue = this.Queue.filter((player) => {
            if (player.id !== playerOne.id && player.id !== playerTwo.id)
              return true;
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
      if (!lobby)
        return reject(new ForbiddenException("user isn't in a lobby"));

      return resolve();
    });
  }

  async CreateGame(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (!lobby)
        return reject(new ForbiddenException("user isn't in a lobby"));
      if (!lobby.playerOne || !lobby.playerTwo)
        return reject(new ForbiddenException('missing player'));
      lobby.game = {
        player: [
          { id: lobby.playerOne, ready: false },
          { id: lobby.playerTwo, ready: false },
        ],
        score: [0, 0],
      };
      return resolve(lobby);
    });
  }

  async PlayerReady(userId: string): Promise<Lobby> {
    return new Promise<Lobby>((resolve, reject) => {
      const lobby = this.LobbyList.find((lobby) => {
        return PlayerIsInLobby(userId, lobby);
      });
      if (lobby.playerOne === userId) lobby.game.player[0].ready = true;
      if (lobby.playerTwo === userId) lobby.game.player[1].ready = true;
      return resolve(lobby);
    });
  }
  /*=============================================*/
}
