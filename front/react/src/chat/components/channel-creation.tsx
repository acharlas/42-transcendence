import { useContext, useRef, useState } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import { ChannelType } from "../type";

function CreateRoomsContainer() {
  const newRoomRef = useRef(null);
  const newPassword = useRef(null);
  const [type, setType] = useState<string>("public");
  const { socket } = useContext(SocketContext).SocketState;
  const { setShowCreateMenu, CreateErrMsg, setCreateErrMsg } = useChat();

  function handleCreateRoom() {
    console.log("socket", socket);
    const roomName = newRoomRef.current.value || "";
    let password: string;

    if (newPassword.current) password = newPassword.current.value || "";
    else password = "";

    console.log("create room", roomName, password);
    if (!String(roomName).trim()) return;

    if (!password.length && type === ChannelType.protected) {
      setCreateErrMsg("a protected room needs a password");
      return;
    }

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
    if (event.target.value !== "protected" && newPassword.current)
      newPassword.current.value = "";
  };

  return (<>
    <form className="create-join-menu-title">
      {CreateErrMsg && <p className="room-chat-err-message">{CreateErrMsg}</p>}
      <p>Name:</p>
      <input
        ref={newRoomRef}
        placeholder="Name..."
        className="create-join-menu-input"
      />
      <p>Room Type:</p>
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
      {type === "protected" && (
        <>
          <p>
            Password:
          </p>
          <input
            ref={newPassword}
            placeholder="Password..."
            className="create-join-menu-input"
          />
        </>
      )}
    </form>
    <button className="fullwidth-button" onClick={handleCreateRoom}>
      CREATE
    </button>
  </>);
}

export default CreateRoomsContainer;
