import { Request } from 'express';
import { Socket } from 'socket.io';

type AuthPayload = {
  userID: string;
  username: string;
};

export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;
