import { useRef } from "react";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";
import "./chat-style.css";

function MessagesContainer({ socket }: { socket: Socket }) {
  const newMessageRef = useRef(null);
  const { setMessages, messages, roomId, username } = useChat();

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
          username: window.sessionStorage.getItem("username"),
          content: message,
        },
      ]);
    }
  }
  if (!roomId) return <div />;
  return (
    <>
      <div className="chat">
        {messages.map((message, index) => {
          return (
            <p className="chat-message" key={index}>
              {message.username}: {message.content}
            </p>
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
