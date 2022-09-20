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
  const [socket, setSocket] = useState<Socket>(io());
  const {
    setRooms,
    setRoomId,
    setMessages,
    messages,
    roomId,
    userList,
    setUserList,
  } = useChat();
  const [showRoom, setShowRoom] = useState(false);
  const [nextRoom, setNextRoom] = useState<string>("");
  const [showUser, setShowUser] = useState<User>();
  let navigate = useNavigate();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    console.log("bearer " + sessionStorage.getItem("Token"));
    setSocket(
      io("http://localhost:3333/chat", {
        auth: {
          token: sessionStorage.getItem("Token"),
        },
      })
    );
  }, []);

  useEffect(() => {
    socket.on("Rooms", ({ rooms }: { rooms: Room[] }) => {
      console.log("Rooms: ", rooms);
      setRooms(rooms);
    });

    socket.on(
      "JoinedRoom",
      ({ roomId, message }: { roomId: string; message: Message[] }) => {
        console.log("joinedRoom");
        console.log("joinedRoom: ", roomId, "message:", { messages });
        setRoomId(roomId);
        if (messages) {
          setMessages(message);
          console.log("set new message: ", messages);
        } else setMessages([]);
        console.log("roomID: ", roomId);
      }
    );

    socket.on("RoomMessage", ({ message }: { message: Message[] }) => {
      console.log("RoomMessage: ", { message });
      setMessages(message);
    });

    socket.on("newMessage", ({ message }: { message: Message[] }) => {
      console.log("newMessage arrive: ", message);
      console.log("oldMessage: ", { messages });
      setMessages(message);
    });

    socket.on("userList", ({ user }: { user: User[] }) => {
      console.log("user list receive:", { user });
      setUserList(user);
    });

    console.log(socket);
  }, [socket]);

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
          {roomId.length === 0 ? (
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
