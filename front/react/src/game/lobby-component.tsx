import { FunctionComponent, useContext } from "react";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";
// import paddleImage from "./assets/paddle.png"

export interface ILobbyComponentProps { }

const LobbyComponent: FunctionComponent<ILobbyComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();

  const handleClick = () => {
    socket.emit("JoiningQueue");
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

  const handleStartGameClick = () => {
    socket.emit("CreateGame");
  };

  return (<>
    <div className="profile__panel__top">Debug stuff?</div>
    <div className="profile__panel__bottom">
      socket: {socket?.id}
      <br />
      <button onClick={handleSendHistoryClick}>Send history</button>
      <button onClick={handleCreateLobbyClick}>Create lobby</button>
    </div>

    <div className="profile__panel__top">Game lobby</div>
    <div className="profile__panel__bottom">
      {lobby ? (<>
        Player 1: {lobby.playerOne}
        Player 2: {lobby.playerTwo}
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
      </>) : (<>
        {inQueue ? (
          "Looking for an opponent..."
        ) : (
          <button onClick={handleClick}>Join matchmaking</button>
        )}
      </>
      )}
    </div>
  </>);
};

export default LobbyComponent;
