import { useContext, useRef } from "react";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";
import "./chat-style.css";
import { User, UserPrivilege } from "./type";

function MessagesComponent() {
  const newMessageRef = useRef(null);
  const {
    setRooms,
    rooms,
    setMessages,
    messages,
    actChannel,
    userList,
    setActChannel,
  } = useChat();
  const { socket } = useContext(SocketContext).SocketState;

  function handleSendMessage() {
    const message = newMessageRef.current.value;
    newMessageRef.current.value = "";

    if (!String(message).trim()) {
      return;
    }
    console.log("send message roomId:", actChannel);
    console.log("message send:", message);
    if (message[0] != null) {
      const user = userList.find((user) => {
        if (user.username === window.sessionStorage.getItem("username"))
          return true;
        return false;
      });
      console.log(
        "user find:",
        user,
        "username:",
        window.sessionStorage.getItem("username")
      );
      socket.emit("SendRoomMessage", {
        roomId: actChannel,
        message: message,
      });

      const newRooms = [...rooms];

      const room = newRooms.find((room) => {
        if (room.channel.id === actChannel) return true;
        return false;
      });

      room.message.push({
        username: window.sessionStorage.getItem("username"),
        content: message,
      });

      console.log("add message after send: ", newRooms);

      setRooms(newRooms);
      setMessages(room.message);
      console.log("oldmessage: ", messages);
    }
  }

  // const handleShowUser = ({ user }: { user: User }) => {
  //   setShowUser(user);
  // };

  if (!actChannel) return <div />;
  return (
    <>
      <div className="chat">
        {messages.map((message, index) => {
          const user = userList.find((user) => {
            if (user.username === message.username) return true;
            return false;
          });
          return (
            <nav key={index}>
              <button
              // onClick={() =>
              //   handleShowUser({
              //     user: user,
              //   })
              // }
              >
                {user ? user.nickname : user.nickname}:
              </button>
              <p className="chat-message">{message.content}</p>
            </nav>
          );
        })}
      </div>
      <div>
        <textarea rows={1} placeholder="time to talk" ref={newMessageRef} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </>
  );
}

export default MessagesComponent;
