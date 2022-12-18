import { createContext, useContext, useState } from "react";
import { Message, Room, User, UserPrivilege } from "../chat/type";

export enum SelectedChatWindow {
  NONE = "None",
  CHANNELS = "Channels",
  MESSAGES = "Messages",
  FRIENDLIST = "Friendlist",
  BLOCKLIST = "Blocklist",
}

export interface IoChatContextState {
  selectedChatWindow: SelectedChatWindow,
  setSelectedChatWindow: Function,
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
  friendList: User[] | undefined;
  setFriendList: Function;
  bloquedList: User[] | undefined;
  setBloquedList: Function;
  showJoinMenu: boolean;
  setShowJoinMenu: Function;
  ShowRoomSetting: Room | undefined;
  setShowRoomSetting: Function;
  closeChatBox: Function;
  setNewRoom: Function;
  JoinErrMsg: string;
  setJoinErrMsg: Function;
  CreateErrMsg: string;
  setCreateErrMsg: Function;
  FriendErrMsg: string;
  setFriendErrMsg: Function;
  BlockErrMsg: string;
  setBlockErrMsg: Function;
  showInviteUser: boolean;
  setShowInviteUser: Function;
  resetErrMsg: Function;
}

const ChatContext = createContext<IoChatContextState>({
  selectedChatWindow: SelectedChatWindow,
  setSelectedChatWindow: () => { },
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
  friendList: undefined,
  setFriendList: () => {},
  bloquedList: undefined,
  setBloquedList: () => {},
  showJoinMenu: false,
  setShowJoinMenu: () => {},
  ShowRoomSetting: undefined,
  setShowRoomSetting: () => {},
  closeChatBox: () => {},
  setNewRoom: () => {},
  JoinErrMsg: undefined,
  setJoinErrMsg: () => {},
  CreateErrMsg: undefined,
  setCreateErrMsg: () => {},
  FriendErrMsg: undefined,
  setFriendErrMsg: () => {},
  BlockErrMsg: undefined,
  setBlockErrMsg: () => {},
  showInviteUser: false,
  setShowInviteUser: () => {},
  resetErrMsg: () => {},
});

function ChatProvider(props: any) {
  const [selectedChatWindow, setSelectedChatWindow] = useState<SelectedChatWindow>(SelectedChatWindow.CHANNELS);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [actChannel, setActChannel] = useState<string>("");
  const [showRoomMenu, setShowRoomMenu] = useState<boolean>(false);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<User>();
  const [showTimeSelector, setShowTimeSelector] = useState<UserPrivilege>(null);
  const [friendList, setFriendList] = useState<User[]>([]);
  const [bloquedList, setBloquedList] = useState<User[]>([]);
  const [showJoinMenu, setShowJoinMenu] = useState<boolean>(false);
  const [ShowRoomSetting, setShowRoomSetting] = useState<Room>(null);
  const [JoinErrMsg, setJoinErrMsg] = useState<string>("");
  const [CreateErrMsg, setCreateErrMsg] = useState<string>("");
  const [FriendErrMsg, setFriendErrMsg] = useState<string>("");
  const [BlockErrMsg, setBlockErrMsg] = useState<string>("");
  const [showInviteUser, setShowInviteUser] = useState<boolean>(false);

  const closeChatBox = () => {
    setMessages([]);
    setActChannel(null);
    setShowRoomSetting(null);
    setShowJoinMenu(false);
    setShowTimeSelector(null);
    setSelectUser(null);
    setShowCreateMenu(null);
    setUserList([]);
    resetErrMsg();
  };

  const resetErrMsg = () => {
    setJoinErrMsg("");
    setCreateErrMsg("");
    setFriendErrMsg("");
    setBlockErrMsg("");
  };

  const setNewRoom = (room: Room) => {
    setSelectUser(null);
    setActChannel(room.channel.id);
    setMessages(room.message);
    setUserList(room.user);
    setUser(
      room.user.find((user) => {
        if (user.username === window.sessionStorage.getItem("username"))
          return true;
        return false;
      })
    );
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChatWindow,
        setSelectedChatWindow,
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
        friendList,
        setFriendList,
        bloquedList,
        setBloquedList,
        showJoinMenu,
        setShowJoinMenu,
        ShowRoomSetting,
        setShowRoomSetting,
        closeChatBox,
        setNewRoom,
        JoinErrMsg,
        setJoinErrMsg,
        CreateErrMsg,
        setCreateErrMsg,
        FriendErrMsg,
        setFriendErrMsg,
        BlockErrMsg,
        setBlockErrMsg,
        showInviteUser,
        setShowInviteUser,
        resetErrMsg,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
