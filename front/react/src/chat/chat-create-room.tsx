import { useContext, useRef, useState } from "react";
import SocketContext from "../context/socket.context";

function CreateRoomsContainer() {
  const newRoomRef = useRef(null);
  const newPassword = useRef(null);
  const [type, setType] = useState<string>("public");
  const { socket } = useContext(SocketContext).SocketState;

  function handleCreateRoom() {
    console.log("socket", socket);
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
    if (newRoomRef.current) newRoomRef.current.value = "";
    if (newPassword.current) newPassword.current.value = "";
  }

  const handleChangeSelect = (event) => {
    console.log(event.target.value);
    setType(event.target.value);
    if (event.target.value !== "protected") newPassword.current.value = "";
  };

  return (
    <div className="create-join-menu-contaner">
      <form className="create-join-menu-title">
        Room Name:
        <input
          ref={newRoomRef}
          placeholder="Room name..."
          className="create-join-menu-input"
        />
        <p />
        Room Type:
        <select
          onChange={handleChangeSelect}
          value={type}
          name="channel type"
          id="channel-select"
          className="create-join-menu-input"
        >
          <option value="public">public</option>
          <option value="protected">protected</option>
          <option value="private">private</option>
        </select>
        {type === "protected" ? (
          <>
            <p />
            Password:
            <input
              ref={newPassword}
              placeholder="Password optional..."
              className="create-join-menu-input"
            />
          </>
        ) : (
          <></>
        )}
      </form>
      <button className="create-join-menu-button" onClick={handleCreateRoom}>
        CREATE ROOM
      </button>
    </div>
  );
}

export default CreateRoomsContainer;
