import { useSockets } from "../context/chat.context";
import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useNavigate } from "react-router-dom";

export default function ChatIndex() {
  const { socket, setUsername } = useSockets();
  console.log("socket", socket);
  console.log("socket", socket.connected);
  let navigate = useNavigate();

  setUsername(sessionStorage.getItem("username"));

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="container">
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
      <div className="screen">
        <>
          <RoomsContainer />
          <MessagesContainer />
        </>
      </div>
    </div>
  );
}
