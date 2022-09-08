import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  message: string;
  username: string;
  time: string;
}

interface Room {
  id: string;
  name: string;
}

interface Context {
  socket?: Socket;
  setSocket: Function;
  username?: string;
  setUsername: Function;
  roomId?: string;
  rooms: Room[];
  messages?: Message[];
  setMessages: Function;
}

const SocketContext = createContext<Context>({
  setUsername: () => false,
  setMessages: () => false,
  setSocket: () => false,
  messages: [],
  rooms: [],
});

function SocketProvider(props: any) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState<Socket>();

  socket.on(
    "Rooms",
    ({
      id,
      name,
      message,
    }: {
      id: string;
      name: string;
      message: Message[];
    }) => {
      setRooms([...rooms, { id, name }]);
      console.log(rooms);
    }
  );

  socket.on("JoinedRoom", (value: string) => {
    setRoomId(value);
    setMessages([]);
  });

  socket.on("RoomMessage", ({ message, username, time }) => {
    setMessages([...messages, { message, username, time }]);
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
        setSocket,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketProvider;
