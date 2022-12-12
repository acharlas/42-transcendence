import { createContext, useContext, useState } from "react";
import { Lobby } from "../game/game-type";

export interface IoGameContextState {
  inQueue: Boolean;
  setInQueue: Function;
  lobby: Lobby;
  setLobby: Function;
}

const GameContext = createContext<IoGameContextState>({
  inQueue: false,
  setInQueue: () => {},
  lobby: undefined,
  setLobby: () => {},
});

function GameProvider(props: any) {
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>(null);

  return (
    <GameContext.Provider
      value={{
        inQueue,
        setInQueue,
        lobby,
        setLobby,
      }}
      {...props}
    />
  );
}

export const useGame = () => useContext(GameContext);

export default GameProvider;
