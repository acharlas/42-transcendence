import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  content: string;
  username: string;
  nickname: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
}

interface User {
  username: string;
  nickname: string;
  privilege: string;
}

interface Context {
  username?: string;
  setUsername: Function;
  roomId?: string;
  setRoomId: Function;
  rooms: Room[];
  setRooms: Function;
  messages?: Message[];
  setMessages: Function;
  userList: User[];
  setUserList: Function;
}

const ChatContext = createContext<Context>({
  setUsername: () => false,
  setMessages: () => false,
  setRoomId: () => false,
  setRooms: () => false,
  setUserList: () => false,
  userList: [],
  username: "",
  roomId: "",
  messages: [],
  rooms: [],
});

function ChatProvider(props: any) {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState<User[]>([]);

  return (
    <ChatContext.Provider
      value={{
        userList,
        setUserList,
        username,
        setUsername,
        rooms,
        setRooms,
        roomId,
        setRoomId,
        messages,
        setMessages,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
