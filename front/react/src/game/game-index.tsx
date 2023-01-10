import { FunctionComponent } from "react";
import GameProvider from "../context/game.context";
import GameComponent from "./game-component";
import SocketGameContextComponent from "./socket-game-component";

export interface IGameIndexProps {}

const GameIndex: FunctionComponent<IGameIndexProps> = (props) => {
  return (
    <GameProvider>
      <GameComponent />
    </GameProvider>
  );
};

export default GameIndex;
