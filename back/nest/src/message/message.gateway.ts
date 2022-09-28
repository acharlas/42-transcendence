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
import { UserPrivilege } from '@prisma/client';
import { Server, Socket, Namespace } from 'socket.io';
import { CreateChannelDto } from 'src/channel/dto';
import { ChannelService } from '../channel/channel.service';
import { SocketWithAuth } from './types_message';

@WebSocketGateway({
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private channelService: ChannelService) {}

  @WebSocketServer() io: Namespace;
  server: Server;

  afterInit(client: Socket): void {
    console.log(`client after init: ${client.id}`);
  }

  handleConnection(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    this.channelService
      .getUserRoom(client.userID)
      .then((res) => {
        console.log('room on connection:', { res });
        client.emit('Rooms', res);
        res.forEach((room) => {
          client.join(room.channel.id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(
      `Client connected: ${client.id} | userid: ${client.userID} | name: ${client.username}`,
    );
    console.log(`number of soket connected: ${socket.size}`);
  }

  handleDisconnect(client: SocketWithAuth): void {
    const socket = this.io.sockets;
    console.log(`Client disconnected: ${client.id} | name: ${client.username}`);
    console.log(`number of soket connected: ${socket.size}`);
  }

  /*==========================================*/
  /*USER CREATE A ROOM*/
  @SubscribeMessage('handshake')
  handshake(client: SocketWithAuth): Promise<void> {
    console.log('sending back user id....');
    client.emit('new_user', client.id);
    return;
  }
  /*==========================================*/
  /*USER CREATE A ROOM*/
  @SubscribeMessage('CreateRoom')
  CreateRoom(
    @MessageBody('CreateChannelDto') roomDto: CreateChannelDto,
    @ConnectedSocket()
    client: SocketWithAuth,
  ): Promise<void> {
    console.log('id:', client.userID, { roomDto });
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .createChannel(client.userID, roomDto)
        .then((ret) => {
          console.log('NewRoom Create Send: ', { ret });
          client.join(ret.channel.id);
          client.emit('NewRoom', { room: ret });
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*==========================================*/
  /*USER SEND A ROOM MESSAGE*/
  @SubscribeMessage('SendRoomMessage')
  sendRoomMessage(
    @MessageBody('roomId') roomId: string,
    @MessageBody('message') message: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('new message arrive:', message);
    return new Promise<void>((resolve, reject) => {
      console.log('SendRoom message', { message }, 'channelId:', roomId);
      this.channelService
        .addChannelMessage(client.userID, roomId, client.username, message)
        .then((ret) => {
          console.log('message resend:', ret, 'roomid: ', roomId);
          client.broadcast
            .to(roomId)
            .emit('RoomMessage', { roomId: roomId, message: ret });
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*=====================================*/
  /* USER JOIN A ROOM*/
  @SubscribeMessage('JoinRoom')
  joinRoom(
    @MessageBody('name') name: string,
    @MessageBody('password') password: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    console.log('join room:', name, 'pass', password);
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .JoinChannelByName(name, client.userID, { password: password })
        .then((ret) => {
          client.join(ret.channel.id);
          client.emit('NewRoom', { room: ret });
          client.broadcast.to(ret.channel.id).emit('JoinRoom', {
            id: ret.channel.id,
            user: ret.user.find((user) => {
              if (user.username === client.username) return true;
              return false;
            }),
          });
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*=====================================*/
  /* USER JOIN A ROOM*/
  @SubscribeMessage('LeaveRoom')
  LeaveRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .leaveChannel(client.userID, roomId)
        .then((ret) => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*============================================*/
  /*User uppdate*/
  @SubscribeMessage('UpdateUserPrivilege')
  UpdateUserPrivilege(
    @MessageBody('roomId') roomId: string,
    @MessageBody('privilege') privilege: UserPrivilege,
    @MessageBody('time') time: Date,
    @MessageBody('toModifie') toModifie: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.channelService
        .channelUserUpdate(client.userID, toModifie, roomId, privilege, time)
        .then(() => {
          return resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /*============================================*/
}
