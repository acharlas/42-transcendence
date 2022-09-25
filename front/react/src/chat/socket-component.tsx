import {
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import ChatContext, { useChat } from "../context/chat.context";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import ChatIndex from "./chat-index";
import { Channel, Message, Room, User } from "./type";

// function Chat() {
//   return (
//     <ChatProvider>
//       <ChatIndex />
//     </ChatProvider>
//   );
// }

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [loading, setLoading] = useState(true);
  const { rooms, setRooms } = useChat();

  const socket = useSocket("http://localhost:3333/chat", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("Token"),
    },
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    /** connect to the web socket */
    socket.connect();
    /** save socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });
    /** start the event listeners */
    /** send the handshake */
    Sendhandshake();
  }, []);

  useEffect(() => {
    /** start the event listeners */
    StartListener();
  }, [socket, rooms]);

  const StartListener = () => {
    /**room list */
    socket.on("Rooms", (res: Room[]) => {
      console.log("room receive:", res);
      setRooms(res);
    });
    /** receive new id */
    socket.on("new_user", (uid: string) => {
      console.log("User connected, new user receive", uid, "last uid");
      SocketDispatch({ type: "update_uid", payload: uid });
    });
    /**receive a new room */
    socket.on("NewRoom", ({ newRoom }: { newRoom: Room }) => {
      const nRoom = [...rooms];
      nRoom.push(newRoom);
      setRooms(nRoom);
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
  const Sendhandshake = () => {
    console.log("sending handshake to server...");

    socket.emit("handshake", async (uid: string, users: string[]) => {
      console.info("User handshake callback message receive");
      SocketDispatch({ type: "update_uid", payload: uid });
    });

    setLoading(false);
  };

  if (loading) return <p>loading</p>;
  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;

// export default Chat;
