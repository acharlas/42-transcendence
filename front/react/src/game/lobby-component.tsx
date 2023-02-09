import { FunctionComponent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";

export interface ILobbyComponentProps {}

const LobbyComponent: FunctionComponent<ILobbyComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();
  let navigate = useNavigate();

  useEffect(() => {
    if (lobby && lobby.game) navigate("/app");
  });

  const handleQueueClick = (gameMode: GameMode) => {
    socket.emit("JoiningQueue", { mode: gameMode });
  };

  const handleLeavingLobbyClick = () => {
    socket.emit("LeavingLobby");
  };

  const handleStartGameClick = () => {
    socket.emit("CreateGame", { mode: GameMode.classic });
  };

  const handleReaddyClick = () => {
    socket.emit("PlayerLobbyReaddy");
  };

  const handleChangeLobbyModeClick = () => {
    socket.emit("ChangeLobbyMode", { mode: lobby.mode === GameMode.classic ? GameMode.hyperspeed : GameMode.classic });
  };

  //user that created game can launch it
  const elemGameLaunch = () => {
    return (
      <button
        className="fullwidth-button"
        disabled={lobby.playerTwo && !lobby?.playerTwo?.readdy}
        onClick={handleStartGameClick}
      >
        Let's pong o.o
      </button>
    );
  };

  //user that was invited can click ready
  const elemReady = () => {
    if (lobby?.playerTwo?.readdy) {
      return (
        <button className="fullwidth-button" onClick={handleReaddyClick}>
          Nope, not ready :s
        </button>
      );
    } else {
      return (
        <button className="fullwidth-button" onClick={handleReaddyClick}>
          I'm ready :)
        </button>
      );
    }
  };

  const elemMatchmaking = () => {
    if (inQueue) {
      return (
        <>
          <div className="profile__panel__top">Matchmaking in progress...</div>
          <div className="profile__panel__bottom">
            <button
              className="fullwidth-button"
              onClick={() => {
                handleQueueClick(GameMode.classic);
              }}
            >
              Cancel :(
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="profile__panel__top">Select a game mode to queue up</div>
          <div className="profile__panel__bottom">
            <button
              className="fullwidth-button"
              onClick={() => {
                handleQueueClick(GameMode.ranked);
              }}
            >
              Serious ranked pong :]
            </button>
            <button
              className="fullwidth-button"
              onClick={() => {
                handleQueueClick(GameMode.hyperspeed);
              }}
            >
              Funny speedy pong :3
            </button>
          </div>
        </>
      );
    }
  };

  const elemLobby = () => {
    return (
      <>
        <div className="profile__panel__top">Game lobby</div>
        <div className="profile__panel__bottom">
          {<div>Player 1: {lobby?.playerOne?.nickname || "?"}</div>}
          {<div>Player 2: {lobby?.playerTwo?.nickname || "Invite someone!"}</div>}
          <button
            className="fullwidth-button"
            disabled={lobby.playerOne.id !== sessionStorage.getItem("userid")}
            onClick={handleChangeLobbyModeClick}
          >
            {lobby.mode}
          </button>
          {lobby?.playerOne &&
            lobby?.playerTwo &&
            (lobby?.playerOne?.id === sessionStorage.getItem("userid") ? elemGameLaunch() : elemReady())}
          <button className="fullwidth-button" onClick={handleLeavingLobbyClick}>
            Leave lobby ._.
          </button>
        </div>
      </>
    );
  };

  return <>{lobby ? elemLobby() : elemMatchmaking()}</>;
};

export default LobbyComponent;
