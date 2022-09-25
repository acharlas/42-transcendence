import { createContext, useContext, useEffect, useState } from "react";
import { Channel, Message, Room, User } from "../chat/type";

export interface IoChatContextState {
  rooms: Room[];
  setRooms: Function;
  user: User | undefined;
  setUser: Function;
  message: Message[];
  setMessage: Function;
  userList: User[];
  setUserList: Function;
  actChannel: string | undefined;
  setActChannel: Function;
  showRoomMenu: boolean;
  setShowRoomMenu: Function;
  showCreateMenu: boolean;
  SetShowCreateMenu: Function;
}

const ChatContext = createContext<IoChatContextState>({
  rooms: [],
  setRooms: () => {},
  user: undefined,
  setUser: () => {},
  message: [],
  setMessage: () => {},
  userList: [],
  setUserList: () => {},
  actChannel: "",
  setActChannel: () => {},
  showRoomMenu: false,
  setShowRoomMenu: () => {},
  showCreateMenu: false,
  SetShowCreateMenu: () => {},
});

function ChatProvider(props: any) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>();
  const [message, setMessage] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [actChannel, setActChannel] = useState<string>("");
  const [showRoomMenu, setShowRoomMenu] = useState<boolean>(false);
  const [showCreateMenu, SetShowCreateMenu] = useState<boolean>(false);

  return (
    <ChatContext.Provider
      value={{
        userList,
        setUserList,
        rooms,
        setRooms,
        actChannel,
        setActChannel,
        message,
        setMessage,
        user,
        setUser,
        showRoomMenu,
        setShowRoomMenu,
        showCreateMenu,
        SetShowCreateMenu,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
