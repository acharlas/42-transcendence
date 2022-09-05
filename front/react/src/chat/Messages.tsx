import { useRef } from "react";
import { useSockets } from "../context/chat.context";

function MessagesContainer() {
  const { socket, messages, roomId, username, setMessages } = useSockets();
  const newMessageRef = useRef(null);

  function handleSendMessage() {
    const message = newMessageRef.current.value;

    if (!String(message).trim()) {
      return;
    }
    socket.emit("SendRoomMessage", { roomId, message, username });
    const date = new Date();
    console.log({ messages });
    setMessages([
      ...messages,
      {
        username: "you",
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);
    setMessages([
      ...messages,
      {
        username: "you",
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);
  }
  console.log({ messages });
  if (!roomId) return <div />;
  return (
    <div>
      {messages.map((message, index) => {
        console.log({ messages });
        return <p key={index}>{message.message}</p>;
      })}

      <div>
        <textarea rows={1} placeholder="time to talk" ref={newMessageRef} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessagesContainer;
