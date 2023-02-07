import React, { FunctionComponent, useContext } from "react";

import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";

export interface ILobbyComponentProps {}

const LobbyComponent: FunctionComponent<ILobbyComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();

  const handleQueueClick = () => {
    socket.emit("JoiningQueue");
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
            <button className="fullwidth-button" onClick={handleQueueClick}>
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
            <button className="fullwidth-button" onClick={handleQueueClick}>
              Serious ranked pong :]
            </button>
            <button className="fullwidth-button" onClick={handleQueueClick}>
              Funny speedy pong :3 (todo)
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
