import { useRef } from "react";
import { FaLock } from "react-icons/fa";
import { Socket } from "socket.io-client";

import { useChat } from "../../context/chat.context";

function LockScreen({
  socket,
  nextRoom,
  setNextRoom,
}: {
  socket: Socket;
  nextRoom: string;
  setNextRoom: Function;
}) {
  const newPassword = useRef(null);
  const { actChannel } = useChat();

  const handleConnectButton = (event) => {
    const pass = newPassword.current.value;
    console.log("next room:", nextRoom, actChannel);
    socket.emit("JoinRoom", { key: nextRoom, old: actChannel, password: pass });
    setNextRoom("");
  };

  return (
    <>
      <div>
        <FaLock />
      </div>
      <div>
        <input ref={newPassword} placeholder="Password..." />
        <button onClick={handleConnectButton}>connect</button>
      </div>
    </>
  );
}

export default LockScreen;
