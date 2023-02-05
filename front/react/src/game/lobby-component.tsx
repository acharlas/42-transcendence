import { FunctionComponent, useContext } from "react";

import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";

export interface ILobbyComponentProps {}

const LobbyComponent: FunctionComponent<ILobbyComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();

  const handleClick = () => {
    socket.emit("JoiningQueue");
  };

  const handleCreateLobbyClick = () => {
    console.log("send create lobby");
    socket.emit("CreateLobby");
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

  return (
    <>
      <div className="profile__panel__top">Debug stuff?</div>
      <div className="profile__panel__bottom">
        socket: {socket?.id}
        <br />
        <button onClick={handleCreateLobbyClick}>Create lobby</button>
      </div>

      <div className="profile__panel__top">Game lobby</div>
      <div className="profile__panel__bottom">
        {lobby ? (
          <>
            {lobby.playerOne && <>Player 1: {lobby.playerOne.nickname}</>}
            {lobby.playerTwo && <>Player 2: {lobby.playerTwo.nickname}</>}
            <button onClick={handleLeavingLobbyClick}>Leave lobby</button>
            {lobby.playerOne && lobby.playerOne.id === sessionStorage.getItem("userid") && (
              <button disabled={lobby.playerTwo && !lobby.playerTwo.readdy} onClick={handleStartGameClick}>
                Start Game
              </button>
            )}
            {lobby.playerTwo && lobby.playerTwo.id === sessionStorage.getItem("userid") && !lobby.playerTwo.readdy && (
              <button onClick={handleReaddyClick}>not Readdy</button>
            )}
            {lobby.playerTwo && lobby.playerTwo.id === sessionStorage.getItem("userid") && lobby.playerTwo.readdy && (
              <button onClick={handleReaddyClick}>readdy</button>
            )}
            <table>
              <tbody>
                <tr>
                  {lobby.invited.map((user, i) => {
                    return <th key={i}>{user}</th>;
                  })}
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            {inQueue ? (
              <button onClick={handleClick}>Leave Queue</button>
            ) : (
              <button onClick={handleClick}>Join matchmaking</button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LobbyComponent;
