import { useSockets } from "../context/chat.context";
import "./chat-style.css";
import RoomsContainer from "./Rooms";
import MessagesContainer from "./Messages";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, Room } from "./type";

export default function ChatIndex() {
  const [socket, setSocket] = useState<Socket>(io());
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState<Message[]>([]);
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
      ({ roomId, messages }: { roomId: string; messages: Message[] }) => {
        console.log("joinedRoom");
        console.log("joinedRoom: ", roomId, "message:", { messages });
        setRoomId(roomId);
        if (messages) {
          setMessages(messages);
          console.log("set new message: ", messages);
        } else setMessages([]);
        console.log("roomID: ", roomId);
      }
    );

    socket.on("RoomMessage", ({ message }: { message: Message[] }) => {
      console.log("RoomMessage: ", { message });
      setMessages(message);
    });

    socket.on("newMessage", ({ message }: { message: Message }) => {
      console.log("newMessage arrive: ", message);
      console.log("oldMessage: ", { messages });
      setMessages([
        ...messages,
        { message: message.message, username: message.username },
      ]);
      setMessages([message]);
      console.log("new message set:", { messages });
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
