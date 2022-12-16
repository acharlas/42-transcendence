import { createContext, useContext, useState } from "react";
import { Lobby } from "../game/game-type";

export interface IoGameContextState {
  inQueue: Boolean;
  setInQueue: Function;
  lobby: Lobby;
  setLobby: Function;
  Removeplayer: Function;
}

const GameContext = createContext<IoGameContextState>({
  inQueue: false,
  setInQueue: () => {},
  lobby: undefined,
  setLobby: () => {},
  Removeplayer: () => {},
});

function GameProvider(props: any) {
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>(null);

  const Removeplayer = (UserId: string) => {
    if (lobby) {
      if (lobby.playerOne === UserId) setLobby({ ...lobby, playerTwo: null });
      else if (lobby.playerTwo === UserId)
        setLobby({
          ...lobby,
          playerOne: lobby.playerTwo,
          playerTwo: null,
        });
    }
  };
  return (
    <GameContext.Provider
      value={{
        inQueue,
        setInQueue,
        lobby,
        setLobby,
        Removeplayer,
      }}
      {...props}
    />
  );
}

export const useGame = () => useContext(GameContext);

export default GameProvider;
