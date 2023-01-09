import { FunctionComponent, useContext } from "react";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();

  const handleClick = () => {
    socket.emit("JoiningQueue");
  };

  const handleCreateLobbyClick = () => {
    socket.emit("CreateLobby");
  };

  const handleLeavingLobbyClick = () => {
    socket.emit("LeavingLobby");
  };

  const handleSendHistoryClick = () => {
    const playerOne = {
      id: "2ce6e635-f65c-4150-ae8c-4293a4227bdb",
      score: 3,
      placement: 2,
    };
    const playerTwo = {
      id: "afc89610-96e7-4ef5-bd9c-2dd279936c2c",
      score: 10,
      placement: 1,
    };
    const newHistory = {
      mode: GameMode.classic,
      score: [playerOne, playerTwo],
    };
    socket.emit("NewHistory", { newHistory: newHistory });
  };

  return (
    <div>
      {socket ? <>salut: {socket.id}</> : <></>}
      {lobby ? (
        <>
          <button>{lobby.playerOne}</button> <button>{lobby.playerTwo}</button>
          <button onClick={handleLeavingLobbyClick}>Leave lobby</button>
        </>
      ) : (
        <>
          {inQueue ? (
            <button>waiting for player</button>
          ) : (
            <>
              <button onClick={handleClick}>join matchmaking</button>
              <button onClick={handleCreateLobbyClick}>create lobby</button>
              <button onClick={handleSendHistoryClick}>send history</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GameComponent;
