import { FunctionComponent, useContext } from "react";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";

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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GameComponent;
