import { createContext, useContext, useState } from "react";
import { Lobby } from "../game/game-type";

export interface IoGameContextState {
  inQueue: Boolean;
  setInQueue: Function;
  lobby: Lobby;
  setLobby: Function;
  Removeplayer: Function;
  ball: Phaser.Physics.Arcade.Sprite;
  player1: Phaser.Physics.Arcade.Sprite;
  player2: Phaser.Physics.Arcade.Sprite;
  keys: Phaser.Input.Keyboard.KeyboardPlugin;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gameStarted: boolean;
  setBall: Function;
  setPlayer1: Function;
  setPlayer2: Function;
  setKeys: Function;
  setCursors: Function;
  setGameStarted: Function;
  gameBounds: { x: number; y: number };
  setGameBounds: Function;
}

const GameContext = createContext<IoGameContextState>({
  inQueue: false,
  setInQueue: () => {},
  lobby: undefined,
  setLobby: () => {},
  Removeplayer: () => {},
  ball: undefined,
  player1: undefined,
  player2: undefined,
  keys: undefined,
  cursors: undefined,
  gameStarted: false,
  setBall: () => {},
  setPlayer1: () => {},
  setPlayer2: () => {},
  setKeys: () => {},
  setCursors: () => {},
  setGameStarted: () => {},
  gameBounds: undefined,
  setGameBounds: () => {},
});

function GameProvider(props: any) {
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>(null);
  const [ball, setBall] = useState<Phaser.Physics.Arcade.Sprite>();
  const [player1, setPlayer1] = useState<Phaser.Physics.Arcade.Sprite>();
  const [player2, setPlayer2] = useState<Phaser.Physics.Arcade.Sprite>();
  const [keys, setKeys] = useState<Phaser.Input.Keyboard.KeyboardPlugin>();
  const [cursors, setCursors] =
    useState<Phaser.Types.Input.Keyboard.CursorKeys>();
  const [gameStarted, setGameStarted] = useState<boolean>();
  const [gameBounds, setGameBounds] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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
        ball,
        player1,
        player2,
        keys,
        cursors,
        gameStarted,
        setBall,
        setPlayer1,
        setPlayer2,
        setKeys,
        setCursors,
        setGameStarted,
        gameBounds,
        setGameBounds,
      }}
      {...props}
    />
  );
}

export const useGame = () => useContext(GameContext);

export default GameProvider;
