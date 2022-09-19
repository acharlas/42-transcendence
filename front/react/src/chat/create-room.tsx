import { useRef, useState } from "react";
import { Socket } from "socket.io-client";

function CreateRoomsContainer({ socket }: { socket: Socket }) {
  const newRoomRef = useRef(null);
  const newPassword = useRef(null);
  const [type, setType] = useState<string>("public");

  function handleCreateRoom() {
    const roomName = newRoomRef.current.value || "";
    let password: string;

    if (newPassword.current) password = newPassword.current.value || "";
    else password = "";

    console.log("create room", roomName, password);
    if (!String(roomName).trim()) return;

    socket.emit("CreateRoom", {
      roomName,
      CreateChannelDto: { name: roomName, type: type, password: password },
    });
    newRoomRef.current.value = "";
    if (newPassword.current) newPassword.current.value = "";
  }

  const handleChangeSelect = (event) => {
    console.log(event.target.value);
    setType(event.target.value);
    if (event.target.value !== "protected") newPassword.current.value = "";
  };

  return (
    <>
      <div className="create-room">
        <div>
          <p>Room Name:</p>
          <input ref={newRoomRef} placeholder="Room name..." />
          <p>Room Type:</p>
          <select
            onChange={handleChangeSelect}
            value={type}
            name="channel type"
            id="channel-select"
          >
            <option value="public">public</option>
            <option value="protected">protected</option>
            <option value="private">private</option>
          </select>
          {type === "protected" ? (
            <>
              <p>Password:</p>
              <input ref={newPassword} placeholder="Password optional..." />
            </>
          ) : (
            <></>
          )}
        </div>
        <button className="create-room-button" onClick={handleCreateRoom}>
          CREATE ROOM
        </button>
      </div>
    </>
  );
}

export default CreateRoomsContainer;
