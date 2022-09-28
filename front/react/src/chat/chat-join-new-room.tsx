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
    <>
      <div>
        <h2>New Room Name</h2>
        <input ref={newRoomRef} placeholder="Room name..." />
        <h2>New Room password</h2>
        <input ref={newPassRef} placeholder="Room password..." />
        <button onClick={handleJoinRoom}>join room</button>
      </div>
    </>
  );
}

export default JoinNewRoomComponent;
