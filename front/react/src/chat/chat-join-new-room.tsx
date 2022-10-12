import { useContext, useRef } from "react";
import SocketContext from "../context/socket.context";

function JoinNewRoomComponent() {
  const newRoomRef = useRef(null);
  const newPassRef = useRef(null);
  const { socket } = useContext(SocketContext).SocketState;

  const handleJoinRoom = (event) => {
    const name = newRoomRef.current.value || "";
    const pass = newPassRef.current.value || "";

    socket.emit("JoinRoom", {
      name: name,
      password: pass,
    });
    if (newPassRef.current) newPassRef.current.value = "";
    if (newRoomRef.current) newRoomRef.current.value = "";
  };

  return (
    <div className="create-join-menu-contaner">
      <form className="create-join-menu-title">
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
