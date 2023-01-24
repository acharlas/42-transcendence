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
      /**** Game-related listeners ****/
      /** Game start */
      socket.on("StartGame", (lobby: Lobby) => {
        console.log("everyone ready: ", lobby);

        setLobby(lobby);
        console.log({ game });
        if (game) game.scene.resume("default");
      });
      /** Game creation */
      socket.on("GameCreate", (lobby: Lobby) => {
        if (lobby) {
          setLobby(lobby);
          navigate("/app/game/" + lobby.id);
        }
      });
      /** setBallPosition */
      socket.on("NewBallPos", (position: Position) => {
        // console.log("ball: ", { position }); //spammy
        if (ball)
          ball.setPosition(
            position.x * gameBounds.x + ball.body.width / 2,
            position.y * gameBounds.y + ball.body.height / 2
          );
      });
      /**setPlayerPosition */
      socket.on("NewPlayerPos", (position: { player: boolean; y: number }) => {
        if (!position.player)
          player2.setPosition(
            ball.width / 2 + 1,
            position.y * gameBounds.y + player1.body.height / 2
          );
        if (position.player)
          player1.setPosition(
            gameBounds.x,
            position.y * gameBounds.y + player1.body.height / 2
          );
      });

      /**** Matchmaking-related listeners ****/
      /** Queue Join */
      socket.on("QueueJoin", () => {
        console.log("joining the queue");
        setInQueue(true);
      });
      /** New match found */
      socket.on("JoinLobby", (lobby: Lobby) => {
        console.log("new lobby arrive ", { lobby });
        setInQueue(false);
        setLobby(lobby);
      });
      /**JoinSpectate*/
      socket.on("JoinSpectate", (lobby: Lobby) => {
        console.log("JoinSpectate: ", { lobby });

        setLobby(lobby);
        if (lobby.game) navigate("/app/game/" + lobby.id);
      });
      /** Player leave the lobby */
      socket.on("PlayerLeave", (uid: string) => {
        console.log("user: ", uid, " leave the lobby");
        Removeplayer(uid);
        navigate("/app/game");
      });
      /** You leave the lobby */
      socket.on("LeaveLobby", (lobbyId: string) => {
        console.log("you leave the lobby: ", lobbyId);
        setInQueue(false);
        setLobby(null);
      });
      /** Receive new id */
      socket.on("new_user", (uid: string) => {
        console.log("User connected, new user received", uid, "last uid");
        SocketDispatch({ type: "update_uid", payload: uid });
      });

      /**** Connection-related listeners ****/
      /** Disconnect */
      socket.on("Disconnect", () => {
        console.log("disconnect");
        socket.disconnect();
      });
      /** Handshake */
      socket.on("handshake", (id: string) => {
        console.log("user id is: ", id);
      });
      /** Reconnect event */
      socket.io.on("reconnect", (attempt) => {
        console.log("Reconnection attempt: " + attempt);
      });
      /** Reconnect attempt event */
      socket.io.on("reconnect_attempt", (attempt) => {
        console.log("Reconnection attempt: " + attempt);
      });
      /** Reconnection error */
      socket.io.on("reconnect_error", (error) => {
        console.log("reconnect error: " + error);
      });
      /** Reconnection failed */
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
