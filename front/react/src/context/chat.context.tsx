import { createContext, useContext, useEffect, useState } from "react";
import { Channel, Message, Room, User } from "../chat/type";

export interface IoChatContextState {
  rooms: Room[];
  setRooms: Function;
  user: User | undefined;
  setUser: Function;
  messages: Message[];
  setMessages: Function;
  userList: User[];
  setUserList: Function;
  actChannel: string | undefined;
  setActChannel: Function;
  showRoomMenu: boolean;
  setShowRoomMenu: Function;
  showCreateMenu: boolean;
  setShowCreateMenu: Function;
  selectUser: User | undefined;
  setSelectUser: Function;
}

const ChatContext = createContext<IoChatContextState>({
  rooms: [],
  setRooms: () => {},
  user: undefined,
  setUser: () => {},
  messages: [],
  setMessages: () => {},
  userList: [],
  setUserList: () => {},
  actChannel: "",
  setActChannel: () => {},
  showRoomMenu: false,
  setShowRoomMenu: () => {},
  showCreateMenu: false,
  setShowCreateMenu: () => {},
  selectUser: undefined,
  setSelectUser: () => {},
});

function ChatProvider(props: any) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [actChannel, setActChannel] = useState<string>("");
  const [showRoomMenu, setShowRoomMenu] = useState<boolean>(false);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<User>();

  return (
    <ChatContext.Provider
      value={{
        selectUser,
        setSelectUser,
        userList,
        setUserList,
        rooms,
        setRooms,
        actChannel,
        setActChannel,
        messages,
        setMessages,
        user,
        setUser,
        showRoomMenu,
        setShowRoomMenu,
        showCreateMenu,
        setShowCreateMenu,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
