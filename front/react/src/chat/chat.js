import React, { useEffect, useState } from "react";
import "./chat-style.css";
import { io } from "socket.io-client";

export default function Chat({ message }) {
  const [socket, setSocket] = useState(io("http://localhost:3333"));
  const [isTyping, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setSocket(io.connect("http://localhost:3333"));
  }, []);

  const click = () => {
    console.log("click");
    socket.emit("findAllMessages", (response) => {
      console.log("response", { response });
      setMessages(response);
    });
  };

  const Message = () => {
    socket.emit("findAllMessages", (response) => {
      console.log("response", { response });
      setMessages(response);

      return messages.forEach((elem) => {
        console.log("elem: ", { elem });
        <p>{elem}</p>;
      });
    });
  };

  return (
    <div className="container">
      <div className="screen">
        <Message />
      </div>
    </div>
  );
}
