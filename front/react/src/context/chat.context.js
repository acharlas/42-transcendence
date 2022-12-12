"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ChatContext = (0, react_1.createContext)({
    rooms: [],
    setRooms: () => { },
    user: undefined,
    setUser: () => { },
    messages: [],
    setMessages: () => { },
    userList: [],
    setUserList: () => { },
    actChannel: "",
    setActChannel: () => { },
    showRoomMenu: false,
    setShowRoomMenu: () => { },
    showCreateMenu: false,
    setShowCreateMenu: () => { },
    selectUser: undefined,
    setSelectUser: () => { },
    showTimeSelector: undefined,
    setShowTimeSelector: () => { },
    showChannel: false,
    setShowChannel: () => { },
    showFriend: false,
    setShowFriend: () => { },
    showBloqued: false,
    setShowBloqued: () => { },
    friendList: undefined,
    setFriendList: () => { },
    bloquedList: undefined,
    setBloquedList: () => { },
    showJoinMenu: false,
    setShowJoinMenu: () => { },
    ShowRoomSetting: undefined,
    setShowRoomSetting: () => { },
    showDm: false,
    setShowDm: () => { },
    closeChatBox: () => { },
    setNewRoom: () => { },
    showChat: false,
    setShowChat: () => { },
    JoinErrMsg: undefined,
    setJoinErrMsg: () => { },
    CreateErrMsg: undefined,
    setCreateErrMsg: () => { },
    FriendErrMsg: undefined,
    setFriendErrMsg: () => { },
    BlockErrMsg: undefined,
    setBlockErrMsg: () => { },
    showInviteUser: false,
    setShowInviteUser: () => { },
    resetErrMsg: () => { },
});
function ChatProvider(props) {
    const [rooms, setRooms] = (0, react_1.useState)([]);
    const [user, setUser] = (0, react_1.useState)(null);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [userList, setUserList] = (0, react_1.useState)([]);
    const [actChannel, setActChannel] = (0, react_1.useState)("");
    const [showRoomMenu, setShowRoomMenu] = (0, react_1.useState)(false);
    const [showCreateMenu, setShowCreateMenu] = (0, react_1.useState)(false);
    const [selectUser, setSelectUser] = (0, react_1.useState)();
    const [showTimeSelector, setShowTimeSelector] = (0, react_1.useState)(null);
    const [showChannel, setShowChannel] = (0, react_1.useState)(false);
    const [showFriend, setShowFriend] = (0, react_1.useState)(false);
    const [showBloqued, setShowBloqued] = (0, react_1.useState)(false);
    const [friendList, setFriendList] = (0, react_1.useState)([]);
    const [bloquedList, setBloquedList] = (0, react_1.useState)([]);
    const [showJoinMenu, setShowJoinMenu] = (0, react_1.useState)(false);
    const [ShowRoomSetting, setShowRoomSetting] = (0, react_1.useState)(null);
    const [showDm, setShowDm] = (0, react_1.useState)(false);
    const [showChat, setShowChat] = (0, react_1.useState)(false);
    const [JoinErrMsg, setJoinErrMsg] = (0, react_1.useState)("");
    const [CreateErrMsg, setCreateErrMsg] = (0, react_1.useState)("");
    const [FriendErrMsg, setFriendErrMsg] = (0, react_1.useState)("");
    const [BlockErrMsg, setBlockErrMsg] = (0, react_1.useState)("");
    const [showInviteUser, setShowInviteUser] = (0, react_1.useState)(false);
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
    const setNewRoom = (room) => {
        setSelectUser(null);
        setActChannel(room.channel.id);
        setMessages(room.message);
        setUserList(room.user);
        setUser(room.user.find((user) => {
            if (user.username === window.sessionStorage.getItem("username"))
                return true;
            return false;
        }));
    };
    return ((0, jsx_runtime_1.jsx)(ChatContext.Provider, Object.assign({ value: {
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
            showDm,
            setShowDm,
            closeChatBox,
            setNewRoom,
            showChat,
            setShowChat,
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
        } }, props)));
}
const useChat = () => (0, react_1.useContext)(ChatContext);
exports.useChat = useChat;
exports.default = ChatProvider;
