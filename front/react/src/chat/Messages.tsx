import { useRef } from "react";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";
import "./chat-style.css";
import { User, UserPrivilege } from "./type";

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
  const { roomShow, setMessages, messages, username, roomId, rooms, userList } =
    useChat();

  function handleSendMessage() {
    const message = newMessageRef.current.value;
    newMessageRef.current.value = "";

    if (!String(message).trim()) {
      return;
    }
    console.log("send message roomId:", roomId);
    console.log("message send:", message);
    if (message[0] != null) {
      const user = userList.find((user) => {
        user.username = username;
      });
      socket.emit("SendRoomMessage", {
        roomId: roomId,
        message: message,
      });
      roomShow.message.push({ content: message, username: user.username });
      setMessages(roomShow.message);
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
          const user = userList.find((user) => {
            if (user.username === message.username) return true;
            return false;
          });
          return (
            <nav key={index}>
              <button
                onClick={() =>
                  handleShowUser({
                    user: user,
                  })
                }
              >
                {user.nickname}:
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
