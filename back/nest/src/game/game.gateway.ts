import { Cron } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { CreateHistoryDto } from 'src/history/dto/create-history.dto';
import { HistoryService } from 'src/history/history.service';
import { socketTab, SocketWithAuth } from '../message/types_message';
import { GameService } from './game.service';
import { Position } from './types_game';
import PlayerIsInLobby from './game.utils';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameService: GameService,
    private historyService: HistoryService, //private schedulerRegistry: SchedulerRegistry,
  ) {}

  SocketList: socketTab[] = [];

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client in game after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;

    console.log('socket list in game: ', this.SocketList);
    const find = this.SocketList.find((socket) => {
      if (socket.userId === client.userID) return true;
      return false;
    });

    if (find) {
      console.log('find to game:', find);
      if (find.socket.id !== client.id) {
        find.socket.emit('Disconnect');
        this.SocketList = this.SocketList.filter((socket) => {
          if (socket.socket.id === find.socket.id) return false;
          return true;
        });
        find.socket.disconnect();
      }
    }
    this.SocketList.push({ userId: client.userID, socket: client });
    const lobby = this.gameService.LobbyList.find((lobby) => {
      return PlayerIsInLobby(client.userID, lobby);
    });
    console.log('lobby find: ', lobby);
    if (lobby) {
      client.join(lobby.id);
      client.emit('JoinLobby', lobby);
    }
    this.SocketList.push({ userId: client.userID, socket: client });
    const lobbyWatch = this.gameService.LobbyList.find((lobby) => {
      if (
        lobby.viewer.find((viewer) => {
          if (viewer === client.userID) return true;
          return false;
        })
      )
        return true;
      return false;
    });
    console.log('lobby watch find: ', lobbyWatch);
    if (lobbyWatch) {
      client.join(lobbyWatch.id);
      client.emit('JoinSpectate', lobbyWatch);
    }
    console.log(
      `Client connected to game: ${client.id} | userid: ${client.userID} | name: ${client.username}`,
    );
    console.log(`number of soket connected to game: ${socket.size}`);
  }

  handleDisconnect(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.SocketList = this.SocketList.filter((sock) => {
      if (sock.userId === client.userID) return false;
      return true;
    });
    console.log(
      `Client disconnected of game: ${client.id} | name: ${client.username}`,
    );
    console.log(`number of soket connected to game: ${socket.size}`);
    this.gameService
      .PlayerDisconnect(client.userID)
      .then((lobbyId) => {
        console.log('lobby found');
        if (lobbyId) {
          client.to(lobbyId).emit('PlayerLeave', client.userID);
          client.leave(lobbyId);
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }
  /*==========================================*/
  @Cron('*/10 * * * * *')
  sync() {
    // console.log('cron');
    this.gameService
      .MatchPlayer()
      .then((newLobby) => {
        // console.log('lobby: ', { newLobby });
        newLobby.forEach((lobby) => {
          const socketPlayerOne = this.SocketList.find((socket) => {
            if (socket.userId === lobby.playerOne) return true;
            return false;
          });
          const socketPlayerTwo = this.SocketList.find((socket) => {
            if (socket.userId === lobby.playerTwo) return true;
            return false;
          });
          // console.log('player one: ', { socketPlayerOne }, ' player two: ', {
          //   socketPlayerTwo,
          // });
          socketPlayerOne.socket.join(lobby.id);
          socketPlayerTwo.socket.join(lobby.id);
          socketPlayerOne.socket.emit('JoinLobby', lobby);
          socketPlayerTwo.socket.emit('JoinLobby', lobby);
          socketPlayerOne.socket.emit('QueueJoin');
          socketPlayerTwo.socket.emit('QueueJoin');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /*==========================================*/
  /*HandShake*/
  @SubscribeMessage('handshake')
  handshake(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('sending back user id....');
    client.emit('handshake', client.id);
    return;
  }
  /*==========================================*/
  /*==========================================*/
  /*Join queue*/
  @SubscribeMessage('JoiningQueue')
  JoiningQueue(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' joining the queue');
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .JoiningQueue(client.userID)
        .then(() => {
          client.emit('QueueJoin');
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }
  /*==========================================*/
  /*==========================================*/
  /*Leaving queue*/
  @SubscribeMessage('LeavingQueue')
  LeavingQueue(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Living the queue');

    return new Promise<void>((resolve, reject) => {
      this.gameService
        .LeavingQueue(client.userID)
        .then(() => {
          client.emit('LeaveQueue');
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
      return resolve();
    });
  }
  /*==========================================*/
  /*==========================================*/
  /*Create lobby*/
  @SubscribeMessage('CreateLobby')
  CreateLobby(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Leaving the queue');
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .CreateLobby(client.userID)
        .then((lobby) => {
          client.join(lobby.id);
          client.emit('JoinLobby', lobby);
          client.to(lobby.id).emit('UserJoinLobby', client.userID);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }
  /*==========================================*/
  /*==========================================*/
  /*Leaving lobby*/
  @SubscribeMessage('LeavingLobby')
  LeavingLobby(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Living the queue');
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .LeaveLobby(client.userID)
        .then((lobbyId) => {
          client.broadcast.to(lobbyId).emit('PlayerLeave', client.userID);
          client.emit('LeaveLobby');
          client.leave(lobbyId);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }
  /*==========================================*/
  /*==========================================*/
  /*new history*/
  @SubscribeMessage('NewHistory')
  NewHistory(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('newHistory') history: CreateHistoryDto,
  ): Promise<void> {
    console.log('historyAdd:', history);
    return new Promise<void>((resolve, reject) => {
      this.historyService
        .createhistory(history)
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }
  /*==========================================*/
  /*==========================================*/
  /*new Player position*/
  @SubscribeMessage('UpdatePlayerPosition')
  UpdatePlayerPosition(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('pos') position: number,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .FindPLayerLobby(client.userID)
        .then((lobby) => {
          if (lobby)
            client.broadcast.to(lobby.id).emit('NewPlayerPos', {
              player: lobby.playerTwo === client.userID,
              y: position,
            });
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*create the game*/
  @SubscribeMessage('CreateGame')
  CreateGame(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .CreateGame(client.userID)
        .then((lobby) => {
          client.broadcast.to(lobby.id).emit('GameCreate', lobby);
          client.emit('GameCreate', lobby);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
      // this.gameService
      //   .FindPLayerLobby(client.userID)
      //   .then((lobby) => {
      //     if (lobby)
      //     client.broadcast.to(lobby.id).emit('NewPlayerPos', position);
      //     return resolve();
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     return reject();
      //   });
    });
  }

  /*Start the game*/
  @SubscribeMessage('GameReaddy')
  GameReaddy(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    return new Promise<void>((resolve, reject) => {});
  }

  /*Start the game*/
  @SubscribeMessage('UpdateBallPosition')
  UpdateBallPosition(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('pos') position: Position,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .FindPLayerLobby(client.userID)
        .then((lobby) => {
          if (lobby) client.broadcast.to(lobby.id).emit('NewBallPos', position);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*Start the game*/
  @SubscribeMessage('StartGame')
  StartGame(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .FindPLayerLobby(client.userID)
        .then((lobby) => {
          client.broadcast.to(lobby.id).emit('StartGame');
          client.emit('StartGame');
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*Start the game*/
  @SubscribeMessage('PlayerReaddy')
  PlayerReaddy(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('playerReaddy');
      this.gameService
        .PlayerReaddy(client.userID)
        .then((lobby) => {
          console.log({ lobby }, lobby.game);
          if (lobby.game.player[0].readdy && lobby.game.player[1].readdy) {
            this.gameService
              .SetGameStart(lobby.id)
              .then((lobby) => {
                client.broadcast.to(lobby.id).emit('StartGame', lobby);
                client.emit('StartGame', lobby);
              })
              .catch((err) => {
                console.log(err);
                return reject();
              });
          }
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }
  /*==========================================*/
}
