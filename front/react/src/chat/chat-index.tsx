import "./chat-style.css";
import { useNavigate } from "react-router-dom";
import { FunctionComponent, useContext } from "react";
import SocketContext from "../context/socket.context";
import { useChat } from "../context/chat.context";
import CreateRoomsContainer from "./chat-create-room";
import { FaAngleLeft } from "react-icons/fa";
import RoomsMenuContainer from "./chat-rooms-menu";
import MessagesContainer from "./chat-messages";

export interface IChatIndexProps {}

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  let navigate = useNavigate();
  const { socket } = useContext(SocketContext).SocketState;
  const { rooms, showRoomMenu, setShowRoomMenu, actChannel } = useChat();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  const handleShowRoomMenu = (event) => {
    showRoomMenu ? setShowRoomMenu(false) : setShowRoomMenu(true);
  };

  if (rooms) console.log({ rooms });
  return (
    <div className="container">
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
      <div className="chat-container">
        <div>
          {showRoomMenu ? (
            <RoomsMenuContainer />
          ) : (
            <>
              <button className="room-button" onClick={handleShowRoomMenu}>
                <FaAngleLeft />
              </button>
            </>
          )}
          {actChannel ? <></> : <></>}
        </div>
      </div>
    </div>
  );
};

export default ChatIndex;
