import { FunctionComponent, useContext } from "react";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";
// import paddleImage from "./assets/paddle.png"

export interface ILobbyComponentProps {}

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

  return (
    <>
      <div>
        {socket ? <>saluto: {socket.id}</> : <></>}
        {lobby ? (
          <>
            <button>{lobby.playerOne}</button>{" "}
            <button>{lobby.playerTwo}</button>
            <button onClick={handleLeavingLobbyClick}>Leave lobby</button>
            <button onClick={handleStartGameClick}>Start Game</button>
            <table>
              <tbody>
                <tr>
                  {lobby.invited.map((user, i) => {
                    return <th key={i}>{user}</th>;
                  })}
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            {inQueue ? (
              <button>waiting for player</button>
            ) : (
              <>
                <button onClick={handleClick}>join matchmaking</button>
                <button onClick={handleCreateLobbyClick}>create lobby</button>
                <button onClick={handleSendHistoryClick}>send history</button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LobbyComponent;
