import "./chat-style.css";
import { useNavigate } from "react-router-dom";
import { FunctionComponent } from "react";
import { useChat } from "../context/chat.context";
import CreateRoomsContainer from "./chat-create-room";
import { FaAngleLeft } from "react-icons/fa";
import RoomsMenuContainer from "./chat-rooms-menu";
import JoinNewRoomComponent from "./chat-join-new-room";
import MessagesComponent from "./chat-messages";
import UserMenu from "./chat-user-menu";
import TimeSelector from "./chat-time-selector";

export interface IChatIndexProps {}

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  let navigate = useNavigate();
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

  const handleShowRoomMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    showRoomMenu ? setShowRoomMenu(false) : setShowRoomMenu(true);
  };

  if (rooms) console.log("rooms at start:", rooms, "userselect: ", selectUser);
  return (
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
  );
};

export default ChatIndex;
