import { Cron, SchedulerRegistry } from '@nestjs/schedule';
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
import { PlayerIsInLobby, PlayerIsReaddy } from './game.utils';
import { GameMode } from '@prisma/client';

@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private historyService: HistoryService,
    private scheduleRegistry: SchedulerRegistry,
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
    console.log(`Client connected to game: ${client.id} | userid: ${client.userID} | name: ${client.username}`);
    console.log(`Number of sockets connected to game: ${socket.size}`);
  }

  handleDisconnect(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.SocketList = this.SocketList.filter((sock) => {
      if (sock.userId === client.userID) return false;
      return true;
    });

    console.log(`Client disconnected of game: ${client.id} | name: ${client.username}`);
    console.log(`Number of sockets connected to game: ${socket.size}`);
    this.gameService
      .PlayerDisconnect(client.userID)
      .then((lobby) => {
        console.log('lobby found');
        if (lobby) {
          const player1 = {
            id: lobby.game.player[1].id,
            score: lobby.game.score[0],
            placement: lobby.game.player[1].id === client.userID ? 2 : 1,
          };
          const player2 = {
            id: lobby.game.player[0].id,
            score: lobby.game.score[1],
            placement: lobby.game.player[0].id === client.userID ? 2 : 1,
          };
          const history = {
            mode: lobby.game.mode,
            score: [player1, player2],
          };

          if (lobby.game && lobby.game.start) {
            //game ended by disconnect
            this.scheduleRegistry.deleteInterval(lobby.id);
            //update ingame status
            this.gameService.decIngameList(player1.id, player2.id);
            if (lobby.game.mode === GameMode.RANKED) {
              //update mmr
              if (player1.placement === 1) {
                this.historyService.updateRankings({winnerId: player1.id, loserId: player2.id});
              } else {
                this.historyService.updateRankings({winnerId: player2.id, loserId: player1.id});
              }
              client.broadcast.to(lobby.id).emit('EndGame', {
                history: {
                  mode: lobby.game.mode,
                  score: [
                    { ...player1, nickName: lobby.playerTwo.nickname },
                    { ...player2, nickName: lobby.playerOne.nickname },
                  ],
                },
                lobby: null,
              });
            } else {
              client.broadcast.to(lobby.id).emit('EndGame', {
                history: {
                  mode: lobby.game.mode,
                  score: [
                    { ...player1, nickName: lobby.playerTwo.nickname },
                    { ...player2, nickName: lobby.playerOne.nickname },
                  ],
                },
                lobby: { ...lobby, game: null },
              });
            }
          }

          client.to(lobby.id).emit('PlayerLeave', client.userID);
          client.leave(lobby.id);
          this.historyService.createhistory(history).then(() => {
            this.gameService
              .EndGame(lobby.game.player[0].id === client.userID ? lobby.game.player[1].id : lobby.game.player[0].id)
              .then(() => {
                return;
              })
              .catch((err) => {
                console.log(err);
                return;
              });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }

  @Cron('*/1 * * * * *')
  sync() {
    // console.log('cron');
    this.gameService
      .MatchPlayer()
      .then((newLobby) => {
        // console.log('lobby: ', { newLobby });
        newLobby.forEach((lobby) => {
          const socketPlayerOne = this.SocketList.find((socket) => {
            if (socket.userId === lobby.playerOne.id) return true;
            return false;
          });
          const socketPlayerTwo = this.SocketList.find((socket) => {
            if (socket.userId === lobby.playerTwo.id) return true;
            return false;
          });
          // console.log('player one: ', { socketPlayerOne }, ' player two: ', {
          //   socketPlayerTwo,
          // });
          socketPlayerOne.socket.join(lobby.id);
          socketPlayerTwo.socket.join(lobby.id);
          socketPlayerOne.socket.emit('GameCreate', lobby);
          socketPlayerTwo.socket.emit('GameCreate', lobby);
          this.CreateGame(socketPlayerOne.socket, GameMode.RANKED);
          socketPlayerOne.socket.emit('QueueJoin');
          socketPlayerTwo.socket.emit('QueueJoin');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /*HandShake*/
  @SubscribeMessage('handshake')
  handshake(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('sending back user id....');
    client.emit('handshake', client.id);
    return;
  }

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

  /*Leaving queue*/
  @SubscribeMessage('LeavingQueue')
  LeavingQueue(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Leaving the queue');

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

  /*Create lobby*/
  @SubscribeMessage('CreateLobby')
  CreateLobby(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, 'create lobby');
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

  /*Leaving lobby*/
  @SubscribeMessage('LeavingLobby')
  LeavingLobby(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, ' Leaving lobby');
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .LeaveLobby(client.userID)
        .then((lobby) => {
          if (lobby) {
            client.broadcast.to(lobby.id).emit('UpdateLobby', lobby);
          }
          client.emit('LeaveLobby');
          client.leave(lobby.id);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*Create lobby*/
  @SubscribeMessage('PlayerLobbyReaddy')
  PlayerLobbbyReaddy(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    console.log('User:', client.userID, 'is readdy');
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .PlayerLobbyReaddy(client.userID)
        .then((lobby) => {
          console.log('end');
          client.emit('UpdateLobby', lobby);
          client.to(lobby.id).emit('UpdateLobby', lobby);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*new history*/
  @SubscribeMessage('NewHistory')
  NewHistory(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('newHistory') history: CreateHistoryDto,
  ): Promise<void> {
    console.log('Received newHistory message:', history);
    this.historyService.updateRankings({winnerId: "c7a689d2-e9db-4469-9607-2a4dc47e311e", loserId: "ee5f9533-0de0-44fe-ac05-8e774d6af6bc"});
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

  /*new Player position*/
  @SubscribeMessage('UpdatePlayerPosition')
  UpdatePlayerPosition(@ConnectedSocket() client: SocketWithAuth, @MessageBody('pos') position: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .UpdatePlayerPos(client.userID, position)
        .then((lobby) => {
          if (lobby)
            client.broadcast.to(lobby.id).emit('NewPlayerPos', {
              player: lobby.playerTwo.id === client.userID,
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
  CreateGame(@ConnectedSocket() client: SocketWithAuth, @MessageBody('mode') mode: GameMode): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.gameService
        .CreateGame(client.userID, mode)
        .then((lobby) => {
          const callback = (): void => {
            this.gameService
              .FindPLayerLobby(client.userID)
              .then((lobby) => {
                if (!lobby.game.start && PlayerIsReaddy(lobby)) {
                  this.gameService
                    .SetGameStart(lobby.id)
                    .then((lobby) => {
                      client.emit('StartGame', lobby);
                      client.broadcast.to(lobby.id).emit('StartGame', lobby);
                      return resolve();
                    })
                    .catch((err) => {
                      console.log(err);
                      return resolve();
                    });
                } else if (lobby.game.start) {
                  this.gameService
                    .UpdateBall(lobby.id)
                    .then((lobby) => {
                      if (lobby.game.score[0] < 2 && lobby.game.score[1] < 2) {
                        client.broadcast.to(lobby.id).emit('NewBallPos', lobby.game.ball.position);
                        client.emit('NewBallPos', lobby.game.ball.position);
                      } else {
                        //game ended by score
                        this.scheduleRegistry.deleteInterval(lobby.id);
                        //update ingame status
                        this.gameService.decIngameList(lobby.game.player[0].id, lobby.game.player[1].id);
                        const player1 = {
                          id: lobby.game.player[1].id,
                          score: lobby.game.score[0],
                          placement: lobby.game.score[0] > lobby.game.score[1] ? 1 : 2,
                        };
                        const player2 = {
                          id: lobby.game.player[0].id,
                          score: lobby.game.score[1],
                          placement: lobby.game.score[1] > lobby.game.score[0] ? 1 : 2,
                        };
                        if (lobby.game.mode === GameMode.RANKED) {
                          //update mmr
                          if (player1.placement === 1) {
                            this.historyService.updateRankings({winnerId: player1.id, loserId: player2.id});
                          } else {
                            this.historyService.updateRankings({winnerId: player2.id, loserId: player1.id});
                          }
                        }
                        const history = {
                          mode: lobby.game.mode,
                          score: [player1, player2],
                        };
                        if (lobby.game.mode === GameMode.RANKED) {
                          client.broadcast.to(lobby.id).emit('EndGame', {
                            history: {
                              mode: lobby.game.mode,
                              score: [
                                { ...player1, nickName: lobby.playerTwo.nickname },
                                { ...player2, nickName: lobby.playerOne.nickname },
                              ],
                            },
                            lobby: null,
                          });
                          client.emit('EndGame', {
                            history: {
                              mode: lobby.game.mode,
                              score: [
                                { ...player1, nickName: lobby.playerTwo.nickname },
                                { ...player2, nickName: lobby.playerOne.nickname },
                              ],
                            },
                            lobby: null,
                          });
                        } else {
                          client.broadcast.to(lobby.id).emit('EndGame', {
                            history: {
                              mode: lobby.game.mode,
                              score: [
                                { ...player1, nickName: lobby.playerTwo.nickname },
                                { ...player2, nickName: lobby.playerOne.nickname },
                              ],
                            },
                            lobby: { ...lobby, game: null },
                          });
                          client.emit('EndGame', {
                            history: {
                              mode: lobby.game.mode,
                              score: [
                                { ...player1, nickName: lobby.playerTwo.nickname },
                                { ...player2, nickName: lobby.playerOne.nickname },
                              ],
                            },
                            lobby: { ...lobby, game: null },
                          });
                        }
                        this.historyService
                          .createhistory(history)
                          .then(() => {
                            this.gameService
                              .EndGame(lobby.playerOne.id)
                              .then(() => {
                                return resolve();
                              })
                              .catch((err) => {
                                console.log(err);
                                return reject();
                              });
                          })
                          .catch((err) => {
                            console.log(err);
                            return reject();
                          });
                      }
                      client.broadcast.to(lobby.id).emit('updateScore', lobby.game.score);
                      client.emit('updateScore', lobby.game.score);
                    })
                    .catch((err) => {
                      console.log(err);
                      return resolve();
                    });
                }
                return resolve();
              })
              .catch((err) => {
                this.scheduleRegistry.deleteInterval(lobby.id);
                console.log(err);
                return;
              });
          };

          const interval = setInterval(callback, 15);
          this.scheduleRegistry.addInterval(lobby.id, interval);
          client.broadcast.to(lobby.id).emit('GameCreate', lobby);
          client.emit('GameCreate', lobby);
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  /*UpdateBallPosition*/
  @SubscribeMessage('UpdateBallPosition')
  UpdateBallPosition(@ConnectedSocket() client: SocketWithAuth, @MessageBody('pos') position: Position): Promise<void> {
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

  /*PlayerReady*/
  @SubscribeMessage('PlayerReady')
  PlayerReady(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('paddleHeight') paddleHeight: number,
    @MessageBody('paddleWitdh') paddleWitdh: number,
    @MessageBody('ballRadius') ballRadius: number,
    @MessageBody('position') position: number,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('PlayerReady', position);
      this.gameService
        .PlayerReady(client.userID, paddleHeight, paddleWitdh, ballRadius, position)
        .then((lobby) => {
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          return reject();
        });
    });
  }

  // /*GamePause*/
  // @SubscribeMessage('GamePause')
  // GamePause(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     console.log('GamePause: ', client.userID);
  //     this.gameService
  //       .FindPLayerLobby(client.userID)
  //       .then((lobby) => {
  //         const callback = () => {
  //           console.log('call back');
  //           client.emit('Surrender', { ...lobby, game: null });
  //           this.gameService.EndGame(client.userID);
  //           this.scheduleRegistry.deleteTimeout(client.userID);
  //           client.broadcast.to(lobby.id).emit('EnnemySurrender', { ...lobby, game: null });
  //         };
  //         return resolve(
  //           new Promise<void>((resolve, reject) => {
  //             this.gameService
  //               .SetLobbyPause(client.userID, callback)
  //               .then((lobby) => {
  //                 client.broadcast.to(lobby.id).emit('GamePause');
  //                 client.emit('GamePause');
  //                 return resolve();
  //               })
  //               .catch((err) => {
  //                 console.log(err);
  //                 return reject(err);
  //               });
  //           }),
  //         );
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         return reject();
  //       });
  //   });
  // }

  // /*GameResume*/
  // @SubscribeMessage('GameResume')
  // GameResume(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     console.log('GameResume: ', client.userID);
  //     this.gameService
  //       .SetLobbyResume(client.userID)
  //       .then((lobby) => {
  //         if (
  //           !lobby.game.player.find((player) => {
  //             if (player.pauseAt) return true;
  //             return false;
  //           })
  //         ) {
  //           client.broadcast.to(lobby.id).emit('GameResume');
  //           client.emit('GameResume');
  //         }
  //         return resolve();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         return reject();
  //       });
  //   });
  // }
}
