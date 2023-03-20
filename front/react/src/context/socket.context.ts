import React, { createContext } from "react";
import { Socket } from "socket.io-client";
import { Room } from "../chat/type";

export interface IoSocketContextState {
  socket: Socket | undefined;
  uid: string;
}

export const defaultSocketContextState: IoSocketContextState = {
  socket: undefined,
  uid: "",
};

export type TSocketContextAction = "update_socket" | "update_uid" | "Rooms";

export type TSocketContextpayload = string | Socket | Room[];

export interface ISocketContextAction {
  type: TSocketContextAction;
  payload: TSocketContextpayload;
}

export const SocketReducer = (state: IoSocketContextState, action: ISocketContextAction) => {
  switch (action.type) {
    case "update_socket":
      //console.log("newsocket", action.payload);
      return { ...state, socket: action.payload as Socket };
    case "update_uid":
      return { ...state, uid: action.payload as string };
    default:
      return { ...state };
  }
};

export interface IoSocketContextProps {
  SocketState: IoSocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextAction>;
}

const SocketContext = createContext<IoSocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
