import { FunctionComponent } from "react";
import GameComponent from "./game-component";
import SocketGameContextComponent from "./socket-game-component";

export interface IGameIndexProps {}

const GameIndex: FunctionComponent<IGameIndexProps> = (props) => {
  return (
    <SocketGameContextComponent>
      <GameComponent />
    </SocketGameContextComponent>
  );
};

export default GameIndex;
