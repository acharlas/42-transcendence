import { useSockets } from "../context/chat.context";
import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useRef } from "react";

export default function Home() {
  const { socket, username, setUsername } = useSockets();
  const usernameRef = useRef(null);
  console.log("socket", socket);
  console.log("socket", socket.connected);

  function handleSetUsername() {
    const value = usernameRef.current.value;
    if (!value) {
      return;
    }
    setUsername(value);
    localStorage.setItem("username", value);
  }

  return (
    <div className="container">
      <div className="screen">
        {!username && (
          <div>
            <input placeholder="Username" ref={usernameRef} />
            <button onClick={handleSetUsername}>start</button>
          </div>
        )}
        {username && (
          <>
            <RoomsContainer />
            <MessagesContainer />
          </>
        )}
      </div>
    </div>
  );
}
