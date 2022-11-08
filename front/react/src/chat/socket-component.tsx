import { PropsWithChildren, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/chat.context";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import {
  Channel,
  Message,
  Room,
  User,
  UserPrivilege,
  UserStatus,
} from "./type";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const {
    rooms,
    setRooms,
    messages,
    userList,
    setActChannel,
    setMessages,
    setUserList,
    setShowRoomMenu,
    setShowCreateMenu,
    actChannel,
    setUser,
    setFriendList,
    setBloquedList,
    setShowJoinMenu,
    setSelectUser,
    setShowRoomSetting,
  } = useChat();

  const socket = useSocket("http://localhost:3333/chat", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("Token"),
    },
  });
  let navigate = useNavigate();

  useEffect(() => {
    /** connect to the web socket */
    console.log("SOCKET CONNECT");
    socket.connect();
    /** save socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });
  }, [socket]);

  useEffect(() => {
    /** start the event listeners */
    socket.removeAllListeners();
    const StartListener = () => {
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
        console.log("update channel: ", { updateChan });
        const newRoom = rooms.map((room) => {
          if (room.channel.id === updateChan.id)
            return {
              channel: updateChan,
              user: room.user,
              messages: room.message,
            };
          return room;
        });
        setRooms(newRoom);
      });
      /**receive a friend list */
      socket.on("FriendList", (friendList: User[]) => {
        setFriendList(friendList);
        console.log("receive friendlist:", { friendList });
      });
      /**receive the bloqued user list */
      socket.on("BloquedList", (bloquedList: User[]) => {
        setBloquedList(bloquedList);
        console.log("receive bloquelist: ", { bloquedList });
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
      socket.on(
        "RoomMessage",
        ({ roomId, message }: { roomId: string; message: Message }) => {
          console.log("message receive on: ", roomId, " message: ", {
            message,
          });
          const newRooms = [...rooms];
          const room = newRooms.find((room) => {
            if (room.channel.id === roomId) return true;
            return false;
          });
          room.message.push(message);
          setRooms(newRooms);
          if (roomId === actChannel) setMessages(room.message);
        }
      );
      /**add a new room */
      socket.on("NewRoom", ({ room, itch }: { room: Room; itch: Boolean }) => {
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
      socket.on("Rooms", (res: Room[]) => {
        console.log("room receive:", res);
        setRooms(res);
      });
      /**UserList update */
      socket.on(
        "UpdateUserList",
        ({ user, roomId }: { user: User[]; roomId: string }) => {
          console.log("updateUserList", user);
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
              if (user.username === window.sessionStorage.getItem("username"))
                return true;
              return false;
            });
            console.log(user);
            setUser({ ...newUser });
            console.log("userList", userList, "priv: ", newUser.privilege);
          }
        }
      );
      /**set a user disconected */
      socket.on(
        "RemoveUser",
        ({ username, roomId }: { username: string; roomId: string }) => {
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
                      status: UserStatus.disconnected,
                    };
                  return user;
                }),
              };
            return room;
          });
          setRooms(newRooms);
        }
      );
      /** receive new id */
      socket.on("new_user", (uid: string) => {
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
  ]);

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;

// export default Chat;
