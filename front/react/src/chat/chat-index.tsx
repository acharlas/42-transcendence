import { useSockets } from "../context/chat.context";
import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, Room } from "./type";

export default function ChatIndex() {
  const [socket, setSocket] = useState<Socket>(
    io("http://localhost:3333/chat", {
      auth: {
        token: sessionStorage.getItem("Token"),
      },
    })
  );
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  let navigate = useNavigate();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  // useEffect(() => {
  //   console.log("bearer " + sessionStorage.getItem("Token"));
  //   setSocket(
  //     io("http://localhost:3333/chat", {
  //       auth: {
  //         token: sessionStorage.getItem("Token"),
  //       },
  //     })
  //   );
  // }, []);

  useEffect(() => {
    socket.on("Rooms", ({ rooms }: { rooms: Room[] }) => {
      console.log(rooms);
      setRooms(rooms);
    });

    socket.on("JoinedRoom", (value: string) => {
      setRoomId(value);
      setMessages([]);
    });

    socket.on("RoomMessage", ({ message, username, time }) => {
      setMessages([...messages, { message, username, time }]);
    });
    console.log(socket);
  }, [socket]);

  return (
    <div className="container">
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
      <div className="screen">
        <>
          <RoomsContainer socket={socket} roomId={roomId} rooms={rooms} />
          <MessagesContainer
            socket={socket}
            messages={messages}
            roomId={roomId}
            username={username}
            setMessages={setMessages}
          />
        </>
      </div>
    </div>
  );
}
