import { useContext, useRef } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";

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
      <form className="create-join-menu-title">
        {JoinErrMsg && (
          <p className="room-chat-err-message">{JoinErrMsg}</p>
        )}
        Name:
        <input
          ref={newRoomRef}
          placeholder="Name..."
          className="create-join-menu-input"
        />
        <p />
        Password (if protected):
        <input
          ref={newPassRef}
          placeholder="Password..."
          className="create-join-menu-input"
        />
      </form>
      <button className="fullwidth-button" onClick={handleJoinRoom}>
        JOIN
      </button>
    </div>
  );
}

export default JoinNewRoomComponent;
