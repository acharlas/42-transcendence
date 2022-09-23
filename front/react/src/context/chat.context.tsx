import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Message, Room, User } from "../chat/type";

interface Context {
  username?: string;
  setUsername: Function;
  roomId?: string;
  setRoomId: Function;
  rooms?: Room[];
  setRooms: Function;
  messages?: Message[];
  setMessages: Function;
  userList: User[];
  setUserList: Function;
  roomShow: Room;
  setRoomShow: Function;
}

const ChatContext = createContext<Context>({
  setUsername: () => false,
  setMessages: () => false,
  setRoomId: () => false,
  setRooms: () => false,
  setUserList: () => false,
  roomShow: null,
  setRoomShow: () => false,
  userList: [],
  username: "",
  messages: [],
});

function ChatProvider(props: any) {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomShow, setRoomShow] = useState<Room>();
  const [messages, setMessages] = useState<Message[]>([]);
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
        setRoomShow,
        roomShow,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
