import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, Room, User } from "./type";
import { useChat } from "../context/chat.context";
import { FaAngleLeft } from "react-icons/fa";
import CreateRoomsContainer from "./create-room";
import LockScreen from "./lock-screen";
import UserMenu from "./user-menu";

export default function ChatIndex() {
  const {
    socket,
    setRooms,
    setRoomId,
    setMessages,
    messages,
    roomId,
    setUserList,
  } = useChat();
  const [showRoom, setShowRoom] = useState(false);
  const [nextRoom, setNextRoom] = useState<string>();
  const [showUser, setShowUser] = useState<User>();
  let navigate = useNavigate();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  const handleShowRoom = (event) => {
    showRoom ? setShowRoom(false) : setShowRoom(true);
  };

  return (
    <div className="container">
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
      <div className="chat-container">
        <>
          {showRoom ? (
            <RoomsContainer
              socket={socket}
              setShowRoom={setShowRoom}
              showRoom={showRoom}
              setNextRoom={setNextRoom}
              setShowUser={setShowUser}
            />
          ) : (
            <>
              <button className="room-button" onClick={handleShowRoom}>
                <FaAngleLeft />
              </button>
            </>
          )}
          {!roomId ? (
            <>
              {nextRoom ? (
                <LockScreen
                  socket={socket}
                  nextRoom={nextRoom}
                  setNextRoom={setNextRoom}
                />
              ) : (
                <CreateRoomsContainer socket={socket} />
              )}
            </>
          ) : (
            <>
              {showUser ? (
                <UserMenu
                  socket={socket}
                  showUser={showUser}
                  setShowUser={setShowUser}
                />
              ) : (
                ""
              )}
              <MessagesContainer
                socket={socket}
                showUser={showUser}
                setShowUser={setShowUser}
              />
            </>
          )}
        </>
      </div>
    </div>
  );
}
