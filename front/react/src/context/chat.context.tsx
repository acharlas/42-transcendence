import { createContext, useContext, useState } from "react";
import { Message, Room, User, UserPrivilege } from "../chat/type";

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
  showTimeSelector: UserPrivilege | undefined;
  setShowTimeSelector: Function;
  showChannel: boolean | undefined;
  setShowChannel: Function;
  showFriend: boolean | undefined;
  setShowFriend: Function;
  showBloqued: boolean;
  setShowBloqued: Function;
  friendList: User[] | undefined;
  setFriendList: Function;
  bloquedList: User[] | undefined;
  setBloquedList: Function;
  showJoinMenu: boolean;
  setShowJoinMenu: Function;
  ShowRoomSetting: Room | undefined;
  setShowRoomSetting: Function;
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
  showTimeSelector: undefined,
  setShowTimeSelector: () => {},
  showChannel: false,
  setShowChannel: () => {},
  showFriend: false,
  setShowFriend: () => {},
  showBloqued: false,
  setShowBloqued: () => {},
  friendList: undefined,
  setFriendList: () => {},
  bloquedList: undefined,
  setBloquedList: () => {},
  showJoinMenu: false,
  setShowJoinMenu: () => {},
  ShowRoomSetting: undefined,
  setShowRoomSetting: () => {},
});

function ChatProvider(props: any) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [actChannel, setActChannel] = useState<string>("");
  const [showRoomMenu, setShowRoomMenu] = useState<boolean>(false);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<User>();
  const [showTimeSelector, setShowTimeSelector] = useState<UserPrivilege>(null);
  const [showChannel, setShowChannel] = useState<boolean>(false);
  const [showFriend, setShowFriend] = useState<boolean>(false);
  const [showBloqued, setShowBloqued] = useState<boolean>(false);
  const [friendList, setFriendList] = useState<User[]>([]);
  const [bloquedList, setBloquedList] = useState<User[]>([]);
  const [showJoinMenu, setShowJoinMenu] = useState<boolean>(false);
  const [ShowRoomSetting, setShowRoomSetting] = useState<Room>(null);

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
        showTimeSelector,
        setShowTimeSelector,
        showBloqued,
        setShowBloqued,
        showChannel,
        setShowChannel,
        showFriend,
        setShowFriend,
        friendList,
        setFriendList,
        bloquedList,
        setBloquedList,
        showJoinMenu,
        setShowJoinMenu,
        ShowRoomSetting,
        setShowRoomSetting,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
