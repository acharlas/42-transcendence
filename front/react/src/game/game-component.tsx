import { FunctionComponent, useContext } from "react";
import SocketContext from "../context/socket.context";

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;

  const handleClick = () => {
    socket.emit("handshake");
  };

  return (
    <>
      <button onClick={handleClick}>Press</button>
    </>
  );
};

export default GameComponent;
