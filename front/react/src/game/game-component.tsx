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

  return (
    <div>
      {inQueue ? (
        <button>waiting for player</button>
      ) : (
        <button onClick={handleClick}>join matchmaking</button>
      )}
      {lobby && (
        <>
          <button>{lobby.playerOne}</button> <button>{lobby.playerTwo}</button>
        </>
      )}
    </div>
  );
};

export default GameComponent;
