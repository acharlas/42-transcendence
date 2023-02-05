import { createContext, useContext, useState, useRef } from "react";
import { history, Lobby, Position } from "../game/game-type";

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
  game: Phaser.Game;
  setBall: Function;
  setPlayer1: Function;
  setPlayer2: Function;
  setKeys: Function;
  setCursors: Function;
  setGame: Function;
  gameBounds: Position;
  setGameBounds: Function;
  timer: Phaser.Time.TimerEvent;
  setTimer: Function;
  player1Score: any;
  player2Score: any;
  history: history;
  setHistory: Function;
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
  game: undefined,
  setBall: () => {},
  setPlayer1: () => {},
  setPlayer2: () => {},
  setKeys: () => {},
  setCursors: () => {},
  setGame: () => {},
  gameBounds: undefined,
  setGameBounds: () => {},
  timer: undefined,
  setTimer: () => {},
  player1Score: undefined,
  player2Score: undefined,
  history: undefined,
  setHistory: () => {},
});

function GameProvider(props: any) {
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>(null);
  const player1Score = useRef<number>(0);
  const player2Score = useRef<number>(0);
  const [ball, setBall] = useState<Phaser.Physics.Arcade.Sprite>();
  const [player1, setPlayer1] = useState<Phaser.Physics.Arcade.Sprite>();
  const [player2, setPlayer2] = useState<Phaser.Physics.Arcade.Sprite>();
  const [keys, setKeys] = useState<Phaser.Input.Keyboard.KeyboardPlugin>();
  const [cursors, setCursors] = useState<Phaser.Types.Input.Keyboard.CursorKeys>();
  const [game, setGame] = useState<boolean>();
  const [gameBounds, setGameBounds] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [timer, setTimer] = useState<Phaser.Time.TimerEvent>();
  const [history, setHistory] = useState<History>();

  const Removeplayer = (UserId: string) => {
    if (lobby) {
      if (lobby.playerOne.id === UserId) setLobby({ ...lobby, playerTwo: null });
      else if (lobby.playerTwo.id === UserId)
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
        game,
        setBall,
        setPlayer1,
        setPlayer2,
        setKeys,
        setCursors,
        setGame,
        gameBounds,
        setGameBounds,
        timer,
        setTimer,
        player1Score,
        player2Score,
        history,
        setHistory,
      }}
      {...props}
    />
  );
}

export const useGame = () => useContext(GameContext);

export default GameProvider;
