import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Message, Room, User } from "./type";
import { useChat } from "../context/chat.context";
import { FaAngleLeft } from "react-icons/fa";
import UserMenu from "./user-menu";
import ChatBodyComponent from "./chat-body";

export default function ChatIndex() {
  const {
    socket,
    roomId,
    setRooms,
    rooms,
    setRoomId,
    setRoomShow,
    setMessages,
    setUserList,
  } = useChat();
  const [showRoom, setShowRoom] = useState<boolean>(false);
  const [nextRoom, setNextRoom] = useState<string>();
  const [showUser, setShowUser] = useState<User>();
  const [JoinNewRoom, setJoinNewRoom] = useState<boolean>(false);
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
              setJoinNewRoom={setJoinNewRoom}
              JoinNewRoom={JoinNewRoom}
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
              <ChatBodyComponent
                socket={socket}
                setNextRoom={setNextRoom}
                nextRoom={nextRoom}
                JoinNewRoom={JoinNewRoom}
              />
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
