import { PropsWithChildren, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { SelectedChatWindow, useChat } from "../context/chat.context";
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import { ErrMessage } from "./chat-error-msg";
import { Channel, ChannelType, Message, Room, User, UserStatus } from "./type";
import { Socket } from "socket.io-client";
import { getMe } from "../api/auth-api";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const {
    rooms,
    setRooms,
    messages,
    userList,
    setActChannel,
    setMessages,
    setUserList,
    setOnlineList,
    actChannel,
    setUser,
    setFriendList,
    bloquedList,
    setBloquedList,
    setSelectUser,
    setShowRoomSetting,
    setJoinErrMsg,
    setBlockErrMsg,
    setFriendErrMsg,
    setCreateErrMsg,
    ShowRoomSetting,
    setInviteList,
    inviteList,
    setHasNewInvite,
    setHasNewChatMessage,
    setHasNewChannelMessage,
    selectedChatWindow,
  } = useChat();

  const socket = useSocket("http://localhost:3333/chat", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("AccessToken"),
    },
  });
  let navigate = useNavigate();

  useEffect(() => {
    console.log("USEEFFECT socket-component connect to the web socket");
    /** connect to the web socket */
    console.log("SOCKET CONNECT");
    socket.connect();
    /** save socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });
  }, [socket]);

  //refresh token
  async function getNewTok(socket: Socket) {
    console.log(sessionStorage.getItem("AccessToken"));
    await getMe();
    // socket.auth.token = sessionStorage.getItem("AccessToken");
    console.log("retry connection");
    const newAuth = { ...socket.auth, token: sessionStorage.getItem("AccessToken") };
    socket.auth = newAuth;
    socket.connect();
  }

  useEffect(() => {
    console.log("USEEFFECT socket-component StartListener");

    /** start the event listeners */
    socket.removeAllListeners();
    const StartListener = () => {
      /**error received */
      socket.on("ErrMessage", ({ code }: { code: string }) => {
        console.log("Error code:", code, "\nError message:", ErrMessage[code]);
        if (code.search("err1") >= 0) {
          setFriendErrMsg(ErrMessage[code]);
        } else if (code.search("err2") >= 0) {
          setBlockErrMsg(ErrMessage[code]);
        } else if (code.search("err3") >= 0) {
          setCreateErrMsg(ErrMessage[code]);
        } else if (code.search("err4") >= 0) {
          setJoinErrMsg(ErrMessage[code]);
        }
      });
      /**join a game lobby */
      socket.on("JoinGame", () => {
        navigate("/app/game");
      });
      /**receive a invite */
      socket.on("GameInvite", (invite: { id: string; username: string }) => {
        console.log("invite receive: ", invite);
        setInviteList([...inviteList, invite]);
        if (selectedChatWindow !== SelectedChatWindow.INVITES) setHasNewInvite(true);
      });
      /**disconnect */
      socket.on("Disconnect", () => {
        console.log("Disconnected");
        window.sessionStorage.clear();
        socket.disconnect();
        navigate("/");
      });
      /**user is banned from chan */
      socket.on("UserBan", (roomId) => {
        console.log("You have been banned from: ", roomId);
      });
      /**remove a room */
      socket.on("RemoveRoom", (channelId) => {
        console.log("Remove room: ", channelId);
        const newRooms = rooms.filter((room) => {
          if (room.channel.id === channelId) return false;
          return true;
        });
        setRooms(newRooms);
        if (actChannel === channelId) {
          setActChannel(null);
          setUserList(null);
        }
      });
      /**update an existing channel */
      socket.on("UpdateRoom", (updateChan: Channel) => {
        console.log("Update channel: ", { updateChan });
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
      socket.on("FriendList", (friendList: User[]) => {
        setFriendList(friendList);
        console.log("Received friendlist:", { friendList });
      });
      /**receive the bloqued user list */
      socket.on("BloquedList", (bloquedList: User[]) => {
        setBloquedList(bloquedList);
        console.log("Received blocklist:", { bloquedList });
      });
      /** A new User join a room*/
      socket.on("JoinRoom", ({ id, user }: { id: string; user: User }) => {
        console.log("user: ", user, "join room: ", id);
        const newRooms = [...rooms];
        const room = newRooms.find((room) => {
          if (room.channel.id === id) return true;
          return false;
        });
        const usr = room.user.find((usr) => {
          if (usr.username === user.username) return true;
          return false;
        });
        if (usr) {
          room.user = room.user.map((usr) => {
            if (usr.username === user.username) {
              return user;
            }
            return usr;
          });
        } else {
          room.user.push(user);
        }
        if (actChannel === id) setUserList(room.user);
        setRooms(newRooms);
      });
      /**receive Room message */
      socket.on("RoomMessage", ({ roomId, message }: { roomId: string; message: Message }) => {
        console.log("Message received on: ", roomId, "\nmessage: ", {
          message,
        });
        const newRooms = [...rooms];
        const room = newRooms.find((room) => {
          return room.channel.id === roomId;
        });
        room.message.push(message);
        if (room.channel.id !== actChannel) room.newMessage = true;
        setRooms(newRooms);
        if (roomId === actChannel) {
          setMessages(room.message);
        } else if (room.channel.type === ChannelType.dm) {
          const sender = room.user.find((sender) => {
            return sender.username !== window.sessionStorage.getItem("username");
          });
          if (
            !bloquedList.find((block) => {
              return block.username === sender.username;
            }) &&
            selectedChatWindow !== SelectedChatWindow.MESSAGES
          ) {
            setHasNewChatMessage(true);
          }
        } else {
          //channel msg
          if (selectedChatWindow !== SelectedChatWindow.CHANNELS) {
            setHasNewChannelMessage(true);
          }
        }
      });
      /**add a new room */
      socket.on("NewRoom", ({ room, itch }: { room: Room; itch: Boolean }) => {
        console.log("New room received: ", room, "try to create: ", [...rooms, room]);
        setRooms([...rooms, room]);
        setMessages(room.message);
        setUserList(room.user);
        setActChannel(room.channel.id);
        const user = room.user.find((user) => {
          if (user.username === window.sessionStorage.getItem("username")) return true;
          return false;
        });
        setUser(user);
        setSelectUser(null);
        setShowRoomSetting(room);
        setActChannel(room.channel.id);
      });
      /**room list */
      socket.on("Rooms", (res: Room[]) => {
        console.log("Room list received:", res);
        res.forEach((room) => {
          room.newMessage = false;
        });
        setRooms(res);
      });
      /**UserList update */
      socket.on("UpdateUserList", ({ user, roomId }: { user: User[]; roomId: string }) => {
        console.log("Updated user list", user);
        const newRooms = rooms.map((room) => {
          if (room.channel.id === roomId) {
            room.user = [...user];
          }
          return room;
        });

        setRooms([...newRooms]);

        const room = newRooms.find((room) => {
          if (room.channel.id === roomId) return true;
          return false;
        });

        if (actChannel === roomId) {
          setUserList(user);
          const newUser = room.user.find((user) => {
            if (user.username === window.sessionStorage.getItem("username")) return true;
            return false;
          });
          console.log(user);
          setUser({ ...newUser });
          console.log("userList", userList, "priv: ", newUser.privilege);
        }
      });
      /**set a user disconected */
      socket.on("RemoveUser", ({ username, roomId }: { username: string; roomId: string }) => {
        console.log("User: ", username, "disconnect from: ", roomId);
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
                    status: UserStatus.disconnected,
                  };
                return user;
              }),
            };
          return room;
        });
        setRooms(newRooms);
        if (roomId === ShowRoomSetting.channel.id) {
          setShowRoomSetting(
            newRooms.find((room) => {
              if (room.channel.id === roomId) return true;
              return false;
            })
          );
        }
      });
      /**receive new id */
      socket.on("new_user", (uid: string) => {
        console.log("User connected, new user received", uid, "last uid");
        SocketDispatch({ type: "update_uid", payload: uid });
      });
      /**reconnect event*/
      socket.io.on("reconnect", (attempt) => {
        console.log("Reconnection attempt: " + attempt);
      });

      /**reconnect attempt event */
      socket.io.on("reconnect_attempt", (attempt) => {
        console.log("Reconnection attempt: " + attempt);
      });

      /**Connection failed */
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
        if (err?.message === "FORBIDDEN") {
          getNewTok(socket);
        }
      });
      /**Reconnection error */
      socket.io.on("reconnect_error", (error) => {
        console.log("Reconnection error: " + error);
      });

      /**Reconnection failed */
      socket.io.on("reconnect_failed", () => {
        console.log("Reconnection failed");
        alert("Connection to chat lost. Please refresh the page.");
      });

      /**Connection failed */
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      /**receive list of online users */
      socket.on("OnlineList", (newOnlineList: User[]) => {
        setOnlineList(newOnlineList);
        console.log("Received onlineList: ", { newOnlineList });
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
    setUser,
    setActChannel,
    navigate,
    setBlockErrMsg,
    setBloquedList,
    setOnlineList,
    setCreateErrMsg,
    setFriendErrMsg,
    setJoinErrMsg,
    setSelectUser,
    setShowRoomSetting,
    setFriendList,
    ShowRoomSetting,
    bloquedList,
    inviteList,
    selectedChatWindow,
    setHasNewChannelMessage,
    setHasNewChatMessage,
    setHasNewInvite,
    setInviteList,
  ]);

  return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>;
};

export default SocketContextComponent;
