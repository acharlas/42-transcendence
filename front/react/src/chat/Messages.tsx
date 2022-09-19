import { useRef } from "react";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";
import "./chat-style.css";
import { User } from "./type";

function MessagesContainer({
  socket,
  showUser,
  setShowUser,
}: {
  socket: Socket;
  showUser: User;
  setShowUser: Function;
}) {
  const newMessageRef = useRef(null);
  const { setMessages, messages, roomId, username, rooms } = useChat();

  function handleSendMessage() {
    const message = newMessageRef.current.value;
    newMessageRef.current.value = "";

    /*if (!String(message).trim()) {
      return;
    }*/
    console.log("send message roomId:", roomId);
    console.log("message send:", message);
    if (message[0] != null) {
      socket.emit("SendRoomMessage", { roomId: roomId, message: message });
      setMessages([
        ...messages,
        {
          nickname: window.sessionStorage.getItem("nickname"),
          username: window.sessionStorage.getItem("username"),
          content: message,
        },
      ]);
    }
  }

  const handleShowUser = ({ user }: { user: User }) => {
    setShowUser(user);
  };

  if (!roomId) return <div />;
  return (
    <>
      <div className="chat">
        {messages.map((message, index) => {
          return (
            <nav key={index}>
              <button
                onClick={() =>
                  handleShowUser({
                    user: {
                      nickname: message.nickname,
                      username: message.username,
                    },
                  })
                }
              >
                {message.nickname}:
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

export default MessagesContainer;
