import { FunctionComponent, useContext } from "react";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";
// import paddleImage from "./assets/paddle.png"

export interface ILobbyComponentProps { }

const LobbyComponent: FunctionComponent<ILobbyComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();

  const handleJoiningQueueClick = () => {
    socket.emit("JoiningQueue");
  };

  const handleLeaveQueueClick = () => {
    console.log("TODO");
  };

  const handleCreateLobbyClick = () => {
    socket.emit("CreateLobby");
  };

  const handleLeavingLobbyClick = () => {
    socket.emit("LeavingLobby");
  };

  const handleSendHistoryClick = () => {
    const playerOne = {
      id: "2ce6e635-f65c-4150-ae8c-4293a4227bdb",
      score: 3,
      placement: 1,
    };
    const playerTwo = {
      id: "afc89610-96e7-4ef5-bd9c-2dd279936c2c",
      score: 0,
      placement: 2,
    };
    const newHistory = {
      mode: GameMode.classic,
      score: [playerOne, playerTwo],
    };
    socket.emit("NewHistory", { newHistory: newHistory });
  };

  const handleCreateGameClick = () => {
    socket.emit("CreateGame");
  };

  return (<>
    <div className="profile__panel__top">
      Game lobby
    </div>
    <div className="profile__panel__bottom">
      {lobby ? (<>
        <div>{`player 1: ${lobby.playerOne}`}</div>
        <div>{`player 2: ${lobby.playerTwo}`}</div>
        <button onClick={handleCreateGameClick}>CreateGame</button>
        <button onClick={handleLeavingLobbyClick}>Cancel</button>
      </>) : (<>
        {inQueue ? (<>
          <div>Looking for an opponent...</div>
          <button onClick={handleLeaveQueueClick}>Leave matchmaking</button>
        </>) : (<>
          <button onClick={handleJoiningQueueClick}>Join matchmaking</button>
        </>)}
      </>)}
    </div>

    <div className="profile__panel__top">
      Debug stuff
    </div>
    <div className="profile__panel__bottom">
      <div>Socket id: {socket?.id}</div>
      <button onClick={handleCreateLobbyClick}>create lobby</button>
      <button onClick={handleSendHistoryClick}>send history</button>
    </div>
  </>);
};

export default LobbyComponent;
