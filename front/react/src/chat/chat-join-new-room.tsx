import { useContext, useRef } from "react";
import { HiXCircle } from "react-icons/hi";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";

function JoinNewRoomComponent() {
  const newRoomRef = useRef(null);
  const newPassRef = useRef(null);
  const { socket } = useContext(SocketContext).SocketState;
  const { setShowJoinMenu, JoinErrMsg } = useChat();

  const handleJoinRoom = (event) => {
    const name = newRoomRef.current.value || "";
    const pass = newPassRef.current.value || "";

    console.log("joining room: ", name);
    socket.emit("JoinRoom", {
      name: name,
      password: pass,
    });
    if (newPassRef.current) newPassRef.current.value = "";
    if (newRoomRef.current) newRoomRef.current.value = "";
  };

  const handleCloseMenu = (event) => {
    setShowJoinMenu(false);
  };

  return (
    <div className="chat-box-container">
      <div className="room-chat-option">
        <button onClick={handleCloseMenu} className="chat-box-button">
          <HiXCircle className="chat-box-button-icon" />
        </button>
      </div>
      <form className="create-join-menu-title">
        {JoinErrMsg ? <p>{JoinErrMsg}</p> : <></>}
        Join Name:
        <input
          ref={newRoomRef}
          placeholder="Room name..."
          className="create-join-menu-input"
        />
        <p />
        Room password
        <input
          ref={newPassRef}
          placeholder="Room password (optional) ..."
          className="create-join-menu-input"
        />
      </form>
      <button className="create-join-menu-button" onClick={handleJoinRoom}>
        JOIN ROOM
      </button>
    </div>
  );
}

export default JoinNewRoomComponent;
