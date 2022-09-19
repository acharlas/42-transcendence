import { FaAngleRight, FaLock } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";

function RoomsContainer({
  socket,
  setShowRoom,
  showRoom,
  setNextRoom,
  setShowUser,
}: {
  socket: Socket;
  setShowRoom: Function;
  showRoom: boolean;
  setNextRoom: Function;
  setShowUser: Function;
}) {
  const { roomId, setRoomId, rooms } = useChat();

  function handleJoinRoom(key: string, type: string) {
    if (key === roomId) return;
    if (type === "protected") {
      setNextRoom(key);
      if (roomId) {
        socket.emit("LeaveRoom", { roomId });
        setRoomId("");
      }
      setShowUser(null);
      showRoom ? setShowRoom(false) : setShowRoom(true);
      return;
    } else socket.emit("JoinRoom", { key, old: roomId });
    showRoom ? setShowRoom(false) : setShowRoom(true);
    setShowUser(null);
  }

  const handleShowRoom = (event) => {
    showRoom ? setShowRoom(false) : setShowRoom(true);
  };

  const handleShowCreateRoom = (event) => {
    if (roomId) {
      socket.emit("LeaveRoom", { roomId });
      setRoomId("");
    }
    setShowUser(null);
    showRoom ? setShowRoom(false) : setShowRoom(true);
  };

  return (
    <nav className="room-menu">
      <div>
        <button
          className="create-room-button-menu"
          onClick={handleShowCreateRoom}
          disabled={roomId === ""}
        >
          create room
        </button>
        <button className="room-button" onClick={handleShowRoom}>
          <FaAngleRight />
        </button>
      </div>
      {rooms.map((room, id) => {
        return (
          <div key={id}>
            <button
              className="join-room-button"
              disabled={room.id === roomId}
              title={`Join ${room.name}`}
              onClick={() => handleJoinRoom(room.id, room.type)}
            >
              {room.type === "protected" ? <FaLock /> : ""}
              {room.name}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

export default RoomsContainer;
