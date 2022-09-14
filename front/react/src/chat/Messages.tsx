import { useRef } from "react";
import { Socket } from "socket.io-client";
import { useSockets } from "../context/chat.context";
import { Message } from "./type";

function MessagesContainer({
  socket,
  messages,
  roomId,
  username,
  setMessages,
}: {
  socket: Socket;
  messages: Message[];
  roomId: string;
  username: string;
  setMessages: Function;
}) {
  const newMessageRef = useRef(null);

  function handleSendMessage() {
    const message = newMessageRef.current.value;
    newMessageRef.current.value = "";

    /*if (!String(message).trim()) {
      return;
    }*/
    console.log("send message roomId:", roomId);
    console.log("message send:", message);
    socket.emit("SendRoomMessage", { roomId: roomId, message: message });
  }
  if (!roomId) return <div />;
  return (
    <div>
      {messages.map((message, index) => {
        return (
          <p key={index}>
            {message.username}: {message.message}
          </p>
        );
      })}
      <div>
        <textarea rows={1} placeholder="time to talk" ref={newMessageRef} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessagesContainer;
