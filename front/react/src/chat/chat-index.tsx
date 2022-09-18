import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, Room } from "./type";
import { useChat } from "../context/chat.context";
import { FaAngleLeft } from "react-icons/fa";

export default function ChatIndex() {
  const [socket, setSocket] = useState<Socket>(io());
  const { setRooms, setRoomId, setMessages, messages } = useChat();
  const [showRoom, setShowRoom] = useState(false);
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
            />
          ) : (
            <>
              <button className="room-button" onClick={handleShowRoom}>
                <FaAngleLeft />
              </button>
            </>
          )}
          <MessagesContainer socket={socket} />
        </>
      </div>
    </div>
  );
}
