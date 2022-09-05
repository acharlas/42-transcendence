import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  roomId?: string;
  rooms: object;
  messages?: { message: string; time: string; username: string }[];
  setMessages: Function;
}

const socket = io("http://localhost:3333");

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
  messages: [],
  rooms: {},
});

function SocketProvider(props: any) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);

  socket.on("Rooms", (value) => {
    setRooms(value);
  });

  socket.on("JoinedRoom", (value) => {
    console.log("joining room", value);
    setRoomId(value);
    setMessages([]);
    console.log("message", messages);
  });

  socket.on("RoomMessage", ({ message, username, time }) => {
    console.log({ messages });
    setMessages([...messages, { message, username, time }]);
    console.log(messages);
  });

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        rooms,
        roomId,
        messages,
        setMessages,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketProvider;
