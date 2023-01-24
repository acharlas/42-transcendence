import { createContext, useContext, useState } from "react";
import { Message, Room, User, UserPrivilege } from "../chat/type";

export enum SelectedChatWindow {
  NONE = "None",
  CHANNELS = "Channels",
  MESSAGES = "Messages",
  INVITES = "Invites",
  FRIENDLIST = "Friendlist",
  BLOCKLIST = "Blocklist",
}

export interface IoChatContextState {
  selectedChatWindow: SelectedChatWindow;
  setSelectedChatWindow: Function;
  rooms: Room[];
  setRooms: Function;
  user: User | undefined;
  setUser: Function;
  messages: Message[];
  setMessages: Function;
  userList: User[];
  setUserList: Function;
  onlineList: User[];
  setOnlineList: Function;
  actChannel: string | undefined;
  setActChannel: Function;
  selectUser: User | undefined;
  setSelectUser: Function;
  showTimeSelector: UserPrivilege | undefined;
  setShowTimeSelector: Function;
  friendList: User[] | undefined;
  setFriendList: Function;
  bloquedList: User[] | undefined;
  setBloquedList: Function;
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
  resetErrMsg: Function;
  inviteList: { id: string; username: string }[];
  setInviteList: Function;
}

const ChatContext = createContext<IoChatContextState>({
  selectedChatWindow: undefined,
  setSelectedChatWindow: () => { },
  rooms: [],
  setRooms: () => { },
  user: undefined,
  setUser: () => { },
  messages: [],
  setMessages: () => { },
  userList: [],
  setUserList: () => { },
  onlineList: [],
  setOnlineList: () => { },
  actChannel: "",
  setActChannel: () => { },
  selectUser: undefined,
  setSelectUser: () => { },
  showTimeSelector: undefined,
  setShowTimeSelector: () => { },
  friendList: undefined,
  setFriendList: () => { },
  bloquedList: undefined,
  setBloquedList: () => { },
  ShowRoomSetting: undefined,
  setShowRoomSetting: () => { },
  closeChatBox: () => { },
  setNewRoom: () => { },
  JoinErrMsg: undefined,
  setJoinErrMsg: () => { },
  CreateErrMsg: undefined,
  setCreateErrMsg: () => { },
  FriendErrMsg: undefined,
  setFriendErrMsg: () => { },
  BlockErrMsg: undefined,
  setBlockErrMsg: () => { },
  resetErrMsg: () => { },
  inviteList: [],
  setInviteList: () => { },
});

function ChatProvider(props: any) {
  const [selectedChatWindow, setSelectedChatWindow] =
    useState<SelectedChatWindow>(SelectedChatWindow.CHANNELS);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [onlineList, setOnlineList] = useState<string[]>([]);
  const [actChannel, setActChannel] = useState<string>("");
  const [selectUser, setSelectUser] = useState<User>();
  const [showTimeSelector, setShowTimeSelector] = useState<UserPrivilege>(null);
  const [friendList, setFriendList] = useState<User[]>([]);
  const [bloquedList, setBloquedList] = useState<User[]>([]);
  const [ShowRoomSetting, setShowRoomSetting] = useState<Room>(null);
  const [JoinErrMsg, setJoinErrMsg] = useState<string>("");
  const [CreateErrMsg, setCreateErrMsg] = useState<string>("");
  const [FriendErrMsg, setFriendErrMsg] = useState<string>("");
  const [BlockErrMsg, setBlockErrMsg] = useState<string>("");
  const [inviteList, setInviteList] = useState<
    {
      id: string;
      username: string;
    }[]
  >([]);

  const closeChatBox = () => {
    setMessages([]);
    setActChannel(null);
    setShowRoomSetting(null);
    setShowTimeSelector(null);
    setSelectUser(null);
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
    setShowRoomSetting(room);
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
        onlineList,
        setOnlineList,
        rooms,
        setRooms,
        actChannel,
        setActChannel,
        messages,
        setMessages,
        user,
        setUser,
        showTimeSelector,
        setShowTimeSelector,
        friendList,
        setFriendList,
        bloquedList,
        setBloquedList,
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
        resetErrMsg,
        inviteList,
        setInviteList,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
