import { useRef } from "react";
import { useSockets } from "../context/chat.context";

function RoomsContainer() {
  const { socket, roomId, rooms } = useSockets();
  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    const roomName = newRoomRef.current.value || "";

    if (!String(roomName).trim()) return;

    socket.emit("CreateRoom", { roomName, old: roomId });
    newRoomRef.current.value = "";
  }

  function handleJoinRoom(key: string) {
    if (key === roomId) return;
    socket.emit("JoinRoom", { key, old: roomId });
  }

  return (
    <nav>
      <div>
        <input ref={newRoomRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>CREATE ROOM</button>
      </div>
      {rooms.map((room, id) => {
        console.log("log", roomId);
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
