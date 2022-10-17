import "./chat-style.css";
import { useNavigate } from "react-router-dom";
import { FunctionComponent, useContext } from "react";
import SocketContext from "../context/socket.context";
import { useChat } from "../context/chat.context";
import CreateRoomsContainer from "./chat-create-room";
import { FaAngleLeft } from "react-icons/fa";
import RoomsMenuContainer from "./chat-rooms-menu";
import JoinNewRoomComponent from "./chat-join-new-room";
import MessagesComponent from "./chat-messages";
import UserMenu from "./chat-user-menu";
import TimeSelector from "./chat-time-selector";

export interface IChatIndexProps { }

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  let navigate = useNavigate();
  const { socket } = useContext(SocketContext).SocketState;
  const {
    showCreateMenu,
    rooms,
    showRoomMenu,
    setShowRoomMenu,
    actChannel,
    selectUser,
    showTimeSelector,
  } = useChat();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };
  const goSettings = () => {
    navigate("/settings");
  }
  const goGame = () => {
    navigate("/game");
  }
  const goChat = () => {
    navigate("/chat");
  }
  const goLeaderboard = () => {
    navigate("/leaderboard");
  }

  const handleShowRoomMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    showRoomMenu ? setShowRoomMenu(false) : setShowRoomMenu(true);
  };

  if (rooms) console.log("rooms at start:", rooms, "userselect: ", selectUser);
  return (
    <div className="container">
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
      <button onClick={goSettings}>
        settings
      </button>
      <button onClick={goGame}>
        game
      </button>
      <button onClick={goChat}>
        chat
      </button>
      <button onClick={goLeaderboard}>
        leaderboard
      </button>
      <div className="chat-container">
        {selectUser ? <UserMenu /> : <></>}
        {showRoomMenu ? (
          <RoomsMenuContainer />
        ) : (
          <>
            <button className="room-button" onClick={handleShowRoomMenu}>
              <FaAngleLeft />
            </button>
          </>
        )}
        {actChannel ? (
          <MessagesComponent />
        ) : showCreateMenu ? (
          <CreateRoomsContainer />
        ) : (
          <JoinNewRoomComponent />
        )}
        {showTimeSelector ? <TimeSelector /> : <></>}
      </div>
    </div>
  );
};

export default ChatIndex;
