import React, { Component, useCallback, useEffect, useState } from "react";
import "./chat-style.css";
import { io, Socket } from "socket.io-client";

type Messages = {
  name: string;
  content: String;
};

interface Props {
  socket: Socket;
  message: Messages[];
}

class Display extends Component<Props> {
  props: Props = {};
  public renderRows = () => {};
}

export default function Chat({ message }) {
  const [socket, setSocket] = useState(io("http://localhost:3333"));
  const [isTyping, setTyping] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([
    { name: "haa", content: "laaaaa" },
  ]);

  useEffect(() => {
    setSocket(io("http://localhost:3333"));
  }, []);

  useEffect(() => {
    socket.emit("findAllMessages", {}, (response) => {
      // console.log({ response });
      // console.log("Degub = " + { ...message, response });
      // setMessages({ ...message, response });
      // console.log({ messages });
    });
    // console.log({ messages });
  }, [socket]);

  const click = () => {
    // console.log("click");
    socket.emit("findAllMessages", (response) => {
      // console.log("response", { response });
      setMessages(response);
    });
  };

  const handleClick = (socket: Socket) => {
    socket.emit("findAllMessages", (res: Messages[]) => {
      setMessages({ ...res });
    });
  };

  const Message = () => {
    socket.emit("findAllMessages", (response) => {
      console.log("response", { response });
      setMessages(response);
      return messages.forEach((elem) => {
        console.log("elem: ", { elem });
        <p>{elem.content}</p>;
      });
    });
  };

  return (
    <div className="container">
      <div className="screen"></div>
      <button onClick={() => handleClick(socket)}>Messages</button>
      <Message />
    </div>
  );
}
