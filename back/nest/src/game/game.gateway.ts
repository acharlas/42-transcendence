import { Cron } from '@nestjs/schedule';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { socketTab, SocketWithAuth } from '../message/types_message';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameService: GameService, //private schedulerRegistry: SchedulerRegistry,
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
        if (lobbyId) client.to(lobbyId).emit('PlayerLeave', client.userID);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }
  /*==========================================*/
  @Cron('*/10 * * * * *')
  sync() {
    console.log('cron');
    this.gameService
      .MatchPlayer()
      .then((newLobby) => {
        console.log('lobby: ', { newLobby });
        newLobby.forEach((lobby) => {
          const socketPlayerOne = this.SocketList.find((socket) => {
            if (socket.userId === lobby.playerOne) return true;
            return false;
          });
          const socketPlayerTwo = this.SocketList.find((socket) => {
            if (socket.userId === lobby.playerTwo) return true;
            return false;
          });
          console.log('player one: ', { socketPlayerOne }, ' player two: ', {
            socketPlayerTwo,
          });
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
  handshake(client: SocketWithAuth): Promise<void> {
    console.log('sending back user id....');
    client.emit('handshake', client.id);
    return;
  }
  /*==========================================*/
  /*==========================================*/
  /*Join queue*/
  @SubscribeMessage('JoiningQueue')
  JoiningQueue(client: SocketWithAuth): Promise<void> {
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
  LeavingQueue(client: SocketWithAuth): Promise<void> {
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
  CreateLobby(client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Living the queue');
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
  /*Create lobby*/
  @SubscribeMessage('CreateLobby')
  LeavingLobby(client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Living the queue');
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .LeaveLobby(client.userID)
        .then((lobbyId) => {
          client.to(lobbyId).emit('UserLeaveLobby', client.userID);
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
}
