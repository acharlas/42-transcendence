import { useRef } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";

function RoomsContainer({
  socket,
  setShowRoom,
  showRoom,
}: {
  socket: Socket;
  setShowRoom: Function;
  showRoom: boolean;
}) {
  const newRoomRef = useRef(null);
  const { roomId, rooms } = useChat();

  function handleCreateRoom() {
    const roomName = newRoomRef.current.value || "";
    console.log("create room", roomName);
    if (!String(roomName).trim()) return;

    socket.emit("CreateRoom", { roomName, old: roomId });
    newRoomRef.current.value = "";
  }

  function handleJoinRoom(key: string) {
    if (key === roomId) return;
    socket.emit("JoinRoom", { key, old: roomId });
  }

  const handleShowRoom = (event) => {
    showRoom ? setShowRoom(false) : setShowRoom(true);
  };

  return (
    <nav className="room-menu">
      <button className="room-button" onClick={handleShowRoom}>
        <FaAngleLeft />
      </button>
      <div>
        <input ref={newRoomRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>CREATE ROOM</button>
      </div>
      {rooms.map((room, id) => {
        return (
          <div key={id}>
            <button
              disabled={room.id === roomId}
              title={`Join ${room.name}`}
              onClick={() => handleJoinRoom(room.id)}
            >
              {room.name}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

export default RoomsContainer;
