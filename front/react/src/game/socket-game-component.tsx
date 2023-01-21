import { PropsWithChildren, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/game.context";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import { Lobby, Position } from "./game-type";

export interface ISocketGameContextComponentProps extends PropsWithChildren {}

const SocketGameContextComponent: React.FunctionComponent<
  ISocketGameContextComponentProps
> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const {
    setInQueue,
    setLobby,
    lobby,
    inQueue,
    Removeplayer,
    player1,
    player2,
    gameBounds,
    ball,
    game,
    setTimer,
  } = useGame();

  const socket = useSocket("http://localhost:3333/game", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("RefreshToken"),
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
      /**start the game */
      socket.on("StartGame", (lobby: Lobby) => {
        console.log("everyone readdy: ", lobby);

        setLobby(lobby);
        console.log({ game });
        if (game) game.scene.resume("default");
      });
      /**game create */
      socket.on("GameCreate", (lobby: Lobby) => {
        if (lobby) {
          setLobby(lobby);
          navigate("/app/game/" + lobby.id);
        }
      });
      /**setBallPosition */
      socket.on("NewBallPos", (position: Position) => {
        console.log("ball: ", { position });
        if (ball)
          ball.setPosition(
            position.x * gameBounds.x + ball.body.width / 2,
            position.y * gameBounds.y + ball.body.height / 2
          );
      });
      /**setPlayerPosition */
      socket.on("NewPlayerPos", (position: number) => {
        if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
          player2.setPosition(
            ball.width / 2 + 1,
            position * gameBounds.y + player1.body.height / 2
          );
        if (lobby.playerOne === window.sessionStorage.getItem("userid"))
          player1.setPosition(
            gameBounds.x,
            position * gameBounds.y + player1.body.height / 2
          );
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
        navigate("/app/game");
      });
      /** you leave the lobby */
      socket.on("LeaveLobby", (lobbyId: string) => {
        console.log("you leave the lobby: ", lobbyId);
        setInQueue(false);
        setLobby(null);
      });
      /** receive new id */
      socket.on("new_user", (uid: string) => {
        console.log("User connected, new user received", uid, "last uid");
        SocketDispatch({ type: "update_uid", payload: uid });
      });
      /** reconnect event*/
      socket.io.on("reconnect", (attempt) => {
        console.log("Reconnection attempt: " + attempt);
      });

      /**reconnect attempt event */
      socket.io.on("reconnect_attempt", (attempt) => {
        console.log("Reconnection attempt: " + attempt);
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
    lobby,
    setLobby,
    setInQueue,
    inQueue,
    ball,
    player1,
    player2,
    game,
  ]);

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketGameContextComponent;
