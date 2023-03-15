import { Request } from 'express';
import { Socket } from 'socket.io';
type AuthPayload = {
    userID: string;
    username: string;
};
type SocketTab = {
    userId: string;
    socket: SocketWithAuth;
};
export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;
export type socketTab = SocketTab;
export {};
