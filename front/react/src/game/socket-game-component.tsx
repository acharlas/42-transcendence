import { PropsWithChildren, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/game.context";
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from "../context/socket.context";
import { useSocket } from "../context/use-socket";
import { Lobby, Position } from "./game-type";

export interface ISocketGameContextComponentProps extends PropsWithChildren {}

const SocketGameContextComponent: React.FunctionComponent<ISocketGameContextComponentProps> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const {
    timer,
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
    player1Score,
    player2Score,
    setHistory,
  } = useGame();

  const socket = useSocket("http://5.182.18.157:3333/game", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem("RefreshToken"),
    },
  });
  let navigate = useNavigate();

  useEffect(() => {
    //console.log("USEEFFECT socket-game-component SOCKET CONNECT");
    /** connect to the web socket */
    //console.log("SOCKET CONNECT");
    socket.connect();
    /** save socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });
  }, [socket]);

  useEffect(() => {
    //console.log("USEEFFECT socket-game-component StartListener");
    /** start the event listeners */
    socket.removeAllListeners();
    const StartListener = () => {
      /**** Game-related listeners ****/
      /** Game Pause */
      socket.on("EndGame", ({ history, lobby }: { history: History; lobby: Lobby }) => {
        //console.log("EndGame: ");
        setLobby(null);
        game.destroy(true); // destroy the game at the end to prevent leaks
        //switch scene game un truc dans le genre

        navigate("/app/game/recap");
        setHistory(history);
      });
      /** Game Pause */
      socket.on("GameResume", () => {
        //console.log("GameResume: ");

        //switch scene game un truc dans le genre
        if (game) game.scene.resume("default");
      });
      /** Surrender */
      socket.on("Surrender", () => {
        //console.log("Surrender: ");
        navigate("/app/game/");
      });
      /** EnnemySurrender */
      socket.on("EnnemySurrender", () => {
        //console.log("EnnemySurrender: ");
        navigate("/app/game/");
      });
      /** Game Pause */
      socket.on("GamePause", () => {
        //console.log("GamePause: ");

        if (game) game.scene.pause("default");
        //switch scene timer un truc dans le genre
      });
      /** Game start */
      socket.on("StartGame", (lobby: Lobby) => {
        //console.log("everyone ready: ", lobby);

        setLobby(lobby);
        //console.log({ game });
        if (timer) timer.paused = !timer.paused;
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
        // //console.log("ball: ", { position });
        if (ball) ball.setPosition(position.x * gameBounds.x, position.y * gameBounds.y);
      });
      /**setPlayerPosition */
      socket.on("NewPlayerPos", (position: { player: boolean; y: number }) => {
        if (!position.player) player2.setPosition(ball.width / 2 + 1, position.y * gameBounds.y);
        if (position.player) player1.setPosition(gameBounds.x, position.y * gameBounds.y);
      });

      /**** Matchmaking-related listeners ****/
      /** Queue Join */
      socket.on("QueueJoin", () => {
        //console.log("joining the queue");
        setInQueue(!inQueue);
      });
      /** New match found */
      socket.on("JoinLobby", (lobby: Lobby) => {
        //console.log("new lobby join ", { lobby });
        navigate("/app/game");
        setInQueue(false);
        setLobby(lobby);
      });
      /**JoinSpectate*/
      socket.on("JoinSpectate", (lobby: Lobby) => {
        //console.log("JoinSpectate: ", { lobby });

        setLobby(lobby);
        if (lobby.game) {
          player1Score.current = lobby.game.score[1];
          player2Score.current = lobby.game.score[0];
        }
        if (lobby.game) navigate("/app/game/" + lobby.id);
      });
      /** Player leave the lobby */
      socket.on("PlayerLeave", (uid: string) => {
        //console.log("user: ", uid, " leave the lobby");
        Removeplayer(uid);
      });
      /** You leave the lobby */
      socket.on("LeaveLobby", (lobbyId: string) => {
        //console.log("you leave the lobby: ", lobbyId);
        setInQueue(false);
        setLobby(null);
      });
      /** update the lobby */
      socket.on("UpdateLobby", (lobby: Lobby) => {
        //console.log("UpdateLobby: ", lobby);
        setLobby(lobby);
      });
      /** Receive new id */
      socket.on("new_user", (uid: string) => {
        //console.log("User connected, new user received", uid, "last uid");
        SocketDispatch({ type: "update_uid", payload: uid });
      });

      /* update score */
      socket.on("updateScore", (newScore: number[]) => {
        // //console.log("rec updateScore", newScore);
        player1Score.current = newScore[1];
        player2Score.current = newScore[0];
      });

      /**** Connection-related listeners ****/
      /** Disconnect */
      socket.on("Disconnect", () => {
        //console.log("disconnect");
        socket.disconnect();
      });
      /** Handshake */
      socket.on("handshake", (id: string) => {
        //console.log("user id is: ", id);
      });
      /** Reconnect event */
      socket.io.on("reconnect", (attempt) => {
        //console.log("Reconnection attempt: " + attempt);
      });
      /** Reconnect attempt event */
      socket.io.on("reconnect_attempt", (attempt) => {
        //console.log("Reconnection attempt: " + attempt);
      });
      /** Reconnection error */
      socket.io.on("reconnect_error", (error) => {
        //console.log("reconnect error: " + error);
      });
      /** Reconnection failed */
      socket.io.on("reconnect_failed", () => {
        //console.log("reconnection failed ");
        alert("we are unable to reconnect you to the web socket");
      });
    };
    StartListener();
  }, [
    socket,
    timer,
    lobby,
    setLobby,
    setInQueue,
    inQueue,
    ball,
    player1,
    player2,
    game,
    player1Score,
    player2Score,
    Removeplayer,
    gameBounds,
    navigate,
    setHistory,
  ]);

  return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>;
};

export default SocketGameContextComponent;
