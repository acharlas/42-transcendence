import { createContext, useContext, useState } from "react";
import { Lobby } from "../game/game-type";

export interface IoGameContextState {
  inQueue: Boolean;
  setInQueue: Function;
  lobby: Lobby;
  setLobby: Function;
  playerTwoPosition: number;
  setPlayerTwoPosition: Function;
  Removeplayer: Function;
}

const GameContext = createContext<IoGameContextState>({
  inQueue: false,
  setInQueue: () => {},
  lobby: undefined,
  setLobby: () => {},
  Removeplayer: () => {},
  playerTwoPosition: undefined,
  setPlayerTwoPosition: () => {},
});

function GameProvider(props: any) {
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>(null);
  const [playerTwoPosition, setPlayerTwoPosition] = useState<number>(0);

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
        playerTwoPosition,
        setPlayerTwoPosition,
      }}
      {...props}
    />
  );
}

export const useGame = () => useContext(GameContext);

export default GameProvider;
