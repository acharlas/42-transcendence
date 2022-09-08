import { useRef } from "react";
import { Socket } from "socket.io-client";
import { useSockets } from "../context/chat.context";
import { Room } from "./type";

function RoomsContainer({
  socket,
  roomId,
  rooms,
}: {
  socket: Socket;
  roomId: string;
  rooms: Room[];
}) {
  const newRoomRef = useRef(null);

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
