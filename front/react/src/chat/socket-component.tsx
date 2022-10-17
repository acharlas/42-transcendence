import { PropsWithChildren, useEffect, useReducer } from "react";
import { useChat } from "../context/chat.context";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import { Message, Room, User } from "./type";

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
  } = useChat();

  const socket = useSocket("http://localhost:3333/chat", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("Token"),
    },
  });

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
        const newRooms = [...rooms];
        const room = newRooms.find((room) => {
          if (room.channel.id === id) return true;
          return false;
        });
        room.user.push(user);
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
      socket.on("NewRoom", ({ room }: { room: Room }) => {
        console.log("new room receive: ", room, "try to create: ", [
          ...rooms,
          room,
        ]);
        setRooms([...rooms, room]);
        setMessages(room.message);
        setUserList(room.user);
        setActChannel(room.channel.id);
        const user = room.user.find((user) => {
          if (user.username === window.sessionStorage.getItem("username"))
            return true;
          return false;
        });
        setUser(user);
        setShowCreateMenu(false);
        setShowRoomMenu(false);
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
