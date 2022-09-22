import { useRef } from "react";
import { Socket } from "socket.io-client";

function JoinNewRoomComponent({
  socket,
}: {
  socket: Socket;
  nextRoom: string;
  setNextRoom: Function;
}) {
  const newRoomRef = useRef(null);
  const newPassRef = useRef(null);

  const handleJoinRoom = (event) => {
    socket.emit("JoinRoom", {
      name: newRoomRef,
      password: newPassRef,
    });
  };

  return (
    <>
      <div>
        <h2>New Room Name</h2>
        <input ref={newRoomRef} placeholder="Room name..." />
        <h2>New Room password</h2>
        <input ref={newRoomRef} placeholder="Room name..." />
        <button onClick={handleJoinRoom}>join room</button>
      </div>
    </>
  );
}

export default JoinNewRoomComponent;
