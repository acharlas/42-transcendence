import { PropsWithChildren, useEffect, useReducer } from "react";
import { useGame } from "../context/game.context";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import { Lobby } from "./game-type";

export interface ISocketGameContextComponentProps extends PropsWithChildren {}

const SocketGameContextComponent: React.FunctionComponent<
  ISocketGameContextComponentProps
> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const { game, setInQueue, setLobby, lobby, inQueue, Removeplayer, player1 } =
    useGame();

  const socket = useSocket("http://localhost:3333/game", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("RefreshToken"),
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
      /**PlayerUnPressKeyDown */
      socket.on("PlayerPressKeyDown", () => {
        console.log("PlayerPressKeyDown");
        player1.setVelocityY(0);
        player1.setVelocityY(350);
      });
      /**new position for player 2 */
      socket.on("PlayerPressKeyUp", () => {
        console.log("PlayerPressKeyUp");
        player1.setVelocityY(0);
        player1.setVelocityY(-350);
      });
      /**new position for player 2 */
      socket.on("PlayerUnPressKey", () => {
        console.log("PlayerUnPressKey");
        player1.setVelocityY(0);
      });
      /**setPlayerPosition */
      socket.on("NewPlayerPos", (position: number) => {
        console.log("NewPlayerPos: ", position);
        player1.setPosition(783, position);
      });
      /**disconnect */
      socket.on("Disconnect", () => {
        console.log("disconnect");
        socket.disconnect();
      });
      /**handshake */
      socket.on("handshake", (id: string) => {
        console.log("user id is: ", id);
      });
      /**Queue Join */
      socket.on("QueueJoin", () => {
        console.log("joining the queue");

        setInQueue(true);
      });
      /**new match found*/
      socket.on("JoinLobby", (lobby: Lobby) => {
        console.log("new lobby arrive ", { lobby });

        setInQueue(false);
        setLobby(lobby);
      });
      /** Player leave the lobby */
      socket.on("PlayerLeave", (uid: string) => {
        console.log("user: ", uid, " leave the lobby");
        Removeplayer(uid);
      });
      /** you leave the lobby */
      socket.on("LeaveLobby", (lobbyId: string) => {
        console.log("you leave the lobby: ", lobbyId);
        setInQueue(false);
        setLobby(null);
      });
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
  }, [socket, lobby, setLobby, setInQueue, inQueue]);

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketGameContextComponent;
