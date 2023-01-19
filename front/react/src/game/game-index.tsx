import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import GameProvider from "../context/game.context";
import LobbyComponent from "./lobby-component";
import GameComponent from "./game-component";
import SocketGameContextComponent from "./socket-game-component";

export interface IGameIndexProps {}
const GameIndex: FunctionComponent<IGameIndexProps> = (props) => {
  return (
    <GameProvider>
      <SocketGameContextComponent>
        <Routes>
          <Route path="/" element={<LobbyComponent />} />
          <Route path="/:id" element={<GameComponent />} />
        </Routes>
      </SocketGameContextComponent>
    </GameProvider>
  );
};

export default GameIndex;
