import "./chat-style.css";
import { useNavigate } from "react-router-dom";
import { FunctionComponent } from "react";
import { useChat } from "../context/chat.context";

import RoomsMenuContainer from "./chat-rooms-menu";
import MessagesComponent from "./chat-messages";

export interface IChatIndexProps {}

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  let navigate = useNavigate();
  const { rooms, showRoomMenu, setShowRoomMenu, selectUser, actChannel } =
    useChat();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  const handleShowRoomMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    showRoomMenu ? setShowRoomMenu(false) : setShowRoomMenu(true);
  };

  if (rooms) console.log("rooms at start:", rooms, "userselect: ", selectUser);
  return (
    <>
      <div className="chat-container">
        <RoomsMenuContainer />
      </div>
      <div>
        {actChannel ? (
          <div>
            <MessagesComponent />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
/**
 *       {selectUser ? <UserMenu /> : <></>}
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
 */

export default ChatIndex;
