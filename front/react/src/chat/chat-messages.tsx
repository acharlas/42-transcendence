import { useContext, useEffect, useRef } from "react";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";
import "./chat-style.css";
import { User } from "./type";

function MessagesComponent() {
  const newMessageRef = useRef(null);
  const bottomRef = useRef(null);
  const {
    setRooms,
    rooms,
    setMessages,
    messages,
    actChannel,
    userList,
    setSelectUser,
    selectUser,
  } = useChat();
  const { socket } = useContext(SocketContext).SocketState;

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSendMessage() {
    const message = newMessageRef.current.value;
    newMessageRef.current.value = "";

    if (!String(message).trim()) {
      return;
    }
    if (message[0] != null) {
      const user = userList.find((user) => {
        if (user.username === window.sessionStorage.getItem("username"))
          return true;
        return false;
      });
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

      setRooms(newRooms);
      setMessages(room.message);
    }
  }

  const handleShowUser = ({ user }: { user: User }) => {
    if (selectUser && selectUser.username === user.username)
      setSelectUser(undefined);
    else setSelectUser(user);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
      newMessageRef.current.value = "";
    }
  };

  if (!actChannel) return <></>;
  return (
    <div className="room-chat-container">
      <div className="room-chat-message-container">
        {messages.map((message, index) => {
          const user = userList.find((user) => {
            if (user.username === message.username) return true;
            return false;
          });
          return (
            <nav key={index} className="room-chat-message-text">
              <button
                className="room-chat-button-user"
                onClick={() =>
                  handleShowUser({
                    user: user,
                  })
                }
              >
                {user ? user.nickname : user.nickname} {" :"}
              </button>
              {message.content}
            </nav>
          );
        })}
        <div ref={bottomRef}></div>
      </div>
      <div className="room-chat-textbox-container">
        <textarea
          className="room-chat-textbox"
          placeholder="time to talk"
          ref={newMessageRef}
          onKeyDown={handleEnter}
        />
      </div>
    </div>
  );
}

export default MessagesComponent;
