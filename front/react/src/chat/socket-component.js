"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = require("../context/socket.context");
const use_socket_1 = require("../context/use-socket");
const chat_error_msg_1 = require("./chat-error-msg");
const type_1 = require("./type");
const SocketContextComponent = (props) => {
    const { children } = props;
    const [SocketState, SocketDispatch] = (0, react_1.useReducer)(socket_context_1.SocketReducer, socket_context_1.defaultSocketContextState);
    const { rooms, setRooms, messages, userList, setActChannel, setMessages, setUserList, setShowRoomMenu, setShowCreateMenu, actChannel, setUser, setFriendList, setBloquedList, setShowJoinMenu, setSelectUser, setShowRoomSetting, setJoinErrMsg, setBlockErrMsg, setFriendErrMsg, setCreateErrMsg, } = (0, chat_context_1.useChat)();
    const socket = (0, use_socket_1.useSocket)("http://localhost:3333/chat", {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false,
        auth: {
            token: sessionStorage.getItem("Token"),
        },
    });
    let navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        /** connect to the web socket */
        console.log("SOCKET CONNECT");
        socket.connect();
        /** save socket in context */
        SocketDispatch({ type: "update_socket", payload: socket });
    }, [socket]);
    (0, react_1.useEffect)(() => {
        /** start the event listeners */
        socket.removeAllListeners();
        const StartListener = () => {
            /**error receive */
            socket.on("ErrMessage", ({ code }) => {
                console.log("erreur aarrived: ", code, "err message: ", chat_error_msg_1.ErrMessage[code]);
                if (code.search("err1") >= 0) {
                    setFriendErrMsg(chat_error_msg_1.ErrMessage[code]);
                }
                else if (code.search("err2") >= 0) {
                    setBlockErrMsg(chat_error_msg_1.ErrMessage[code]);
                }
                else if (code.search("err3") >= 0) {
                    setCreateErrMsg(chat_error_msg_1.ErrMessage[code]);
                }
                else if (code.search("err4") >= 0) {
                    setJoinErrMsg(chat_error_msg_1.ErrMessage[code]);
                }
            });
            /**disconnect */
            socket.on("Disconnect", () => {
                console.log("disconnect");
                window.sessionStorage.clear();
                socket.disconnect();
                navigate("/");
            });
            /**user is ban from chan */
            socket.on("UserBan", (roomId) => {
                console.log("you have been ban from: ", roomId);
            });
            /**remove a room */
            socket.on("RemoveRoom", (channelId) => {
                console.log("remove room: ", channelId);
                const newRooms = rooms.filter((room) => {
                    if (room.channel.id === channelId)
                        return false;
                    return true;
                });
                setRooms(newRooms);
                if (actChannel === channelId) {
                    setActChannel(null);
                    setUserList(null);
                }
            });
            /**update an existing channel */
            socket.on("UpdateRoom", (updateChan) => {
                console.log("update channel: ", { updateChan });
                const newRoom = rooms.map((room) => {
                    if (room.channel.id === updateChan.id)
                        return {
                            channel: updateChan,
                            user: room.user,
                            message: room.message,
                        };
                    return room;
                });
                setRooms(newRoom);
            });
            /**receive a friend list */
            socket.on("FriendList", (friendList) => {
                setFriendList(friendList);
                console.log("receive friendlist:", { friendList });
            });
            /**receive the bloqued user list */
            socket.on("BloquedList", (bloquedList) => {
                setBloquedList(bloquedList);
                console.log("receive bloquelist: ", { bloquedList });
            });
            /** A new User join a room*/
            socket.on("JoinRoom", ({ id, user }) => {
                console.log("user: ", user, "join room: ", id);
                const newRooms = [...rooms];
                const room = newRooms.find((room) => {
                    if (room.channel.id === id)
                        return true;
                    return false;
                });
                const usr = room.user.find((usr) => {
                    if (usr.username === user.username)
                        return true;
                    return false;
                });
                if (usr) {
                    room.user = room.user.map((usr) => {
                        if (usr.username === user.username) {
                            return user;
                        }
                        return usr;
                    });
                }
                else {
                    room.user.push(user);
                }
                if (actChannel === id)
                    setUserList(room.user);
                setRooms(newRooms);
            });
            /**receive Room message */
            socket.on("RoomMessage", ({ roomId, message }) => {
                console.log("message receive on: ", roomId, " message: ", {
                    message,
                });
                const newRooms = [...rooms];
                const room = newRooms.find((room) => {
                    if (room.channel.id === roomId)
                        return true;
                    return false;
                });
                room.message.push(message);
                if (room.channel.id !== actChannel)
                    room.newMessage = true;
                setRooms(newRooms);
                if (roomId === actChannel)
                    setMessages(room.message);
            });
            /**add a new room */
            socket.on("NewRoom", ({ room, itch }) => {
                console.log("new room receive: ", room, "try to create: ", [
                    ...rooms,
                    room,
                ]);
                setRooms([...rooms, room]);
                if (itch) {
                    setMessages(room.message);
                    setUserList(room.user);
                    setActChannel(room.channel.id);
                }
                const user = room.user.find((user) => {
                    if (user.username === window.sessionStorage.getItem("username"))
                        return true;
                    return false;
                });
                if (itch) {
                    setUser(user);
                    setShowCreateMenu(false);
                    setShowRoomMenu(false);
                    setSelectUser(null);
                    setShowJoinMenu(false);
                    setShowRoomSetting(null);
                }
            });
            /**room list */
            socket.on("Rooms", (res) => {
                console.log("room receive:", res);
                res.forEach((room) => {
                    room.newMessage = false;
                });
                setRooms(res);
            });
            /**UserList update */
            socket.on("UpdateUserList", ({ user, roomId }) => {
                console.log("updateUserList", user);
                const newRooms = rooms.map((room) => {
                    if (room.channel.id === roomId) {
                        room.user = [...user];
                    }
                    return room;
                });
                setRooms([...newRooms]);
                const room = newRooms.find((room) => {
                    if (room.channel.id === roomId)
                        return true;
                    return false;
                });
                if (actChannel === roomId) {
                    setUserList(user);
                    const newUser = room.user.find((user) => {
                        if (user.username === window.sessionStorage.getItem("username"))
                            return true;
                        return false;
                    });
                    console.log(user);
                    setUser(Object.assign({}, newUser));
                    console.log("userList", userList, "priv: ", newUser.privilege);
                }
            });
            /**set a user disconected */
            socket.on("RemoveUser", ({ username, roomId }) => {
                console.log("user: ", username, "disconnect from: ", roomId);
                const newRooms = rooms.map((room) => {
                    if (room.channel.id === roomId)
                        return {
                            channel: room.channel,
                            message: room.message,
                            user: room.user.map((user) => {
                                if (user.username === username)
                                    return {
                                        username: user.username,
                                        nickname: user.nickname,
                                        privilege: user.privilege,
                                        status: type_1.UserStatus.disconnected,
                                    };
                                return user;
                            }),
                        };
                    return room;
                });
                setRooms(newRooms);
            });
            /** receive new id */
            socket.on("new_user", (uid) => {
                console.log("User connected, new user receive", uid, "last uid");
                SocketDispatch({ type: "update_uid", payload: uid });
            });
            /** reconnect event*/
            socket.io.on("reconnect", (attempt) => {
                console.log("reconnect on attempt: " + attempt);
            });
            /**reconnect attempt event */
            socket.io.on("reconnect_attempt", (attempt) => {
                console.log("reconnect on attempt: " + attempt);
            });
            /**Reconnection error */
            socket.io.on("reconnect_error", (error) => {
                console.log("reconnect error: " + error);
            });
            /**Reconnection failed */
            socket.io.on("reconnect_failed", () => {
                console.log("reconnection failed ");
                alert("we are unable to reconnect you to the web socket");
            });
        };
        StartListener();
    }, [
        socket,
        rooms,
        messages,
        userList,
        actChannel,
        setUserList,
        setMessages,
        setRooms,
        setShowCreateMenu,
        setUser,
        setActChannel,
        setShowRoomMenu,
        navigate,
        setBlockErrMsg,
        setBloquedList,
        setCreateErrMsg,
        setFriendErrMsg,
        setJoinErrMsg,
        setSelectUser,
        setShowJoinMenu,
        setShowRoomSetting,
        setFriendList,
    ]);
    return ((0, jsx_runtime_1.jsx)(socket_context_1.SocketContextProvider, Object.assign({ value: { SocketState, SocketDispatch } }, { children: children })));
};
exports.default = SocketContextComponent;
