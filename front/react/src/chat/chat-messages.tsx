import { useContext, useEffect, useRef } from "react";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";
import { HiXCircle } from "react-icons/hi";

import { GiCat } from "react-icons/gi";
import "./chat-style.css";
import { User } from "./type";
import UserMenu from "./chat-user-menu";
import TimeSelector from "./chat-time-selector";

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
    user,
    setActChannel,
    showTimeSelector,
    bloquedList,
    closeChatBox,
  } = useChat();
  const { socket } = useContext(SocketContext).SocketState;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  // bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  function handleSendMessage() {
    const message = newMessageRef.current.value;
    newMessageRef.current.value = "";

    console.log("actual channel send message: ", actChannel);

    if (!String(message).trim()) {
      return;
    }
    if (message[0] != null) {
      userList.find((user) => {
        if (user.username === window.sessionStorage.getItem("username"))
          return true;
        return false;
      });
      socket.emit("SendRoomMessage", {
        roomId: actChannel,
        message: message,
      });
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

  const handleCloseChat = (event) => {
    closeChatBox();
  };

  if (!actChannel) return <></>;
  return (
    <div className="chat-box-container">
      <div className="room-chat-option">
        <button onClick={handleCloseChat} className="chat-box-button">
          <HiXCircle className="chat-box-button-icon" />
        </button>
        {selectUser ? <UserMenu /> : <></>}
      </div>
      <div className="room-chat-message-container">
        {messages.map((message, index) => {
          const msgUser = userList.find((user) => {
            if (user.username === message.username) return true;
            return false;
          });
          if (
            !bloquedList.find((bloque) => {
              if (bloque.username === message.username) return true;
              return false;
            })
          )
            return (
              <div key={index} className="room-chat-message-text">
                <button
                  className="room-chat-button-user"
                  onClick={() =>
                    handleShowUser({
                      user: msgUser,
                    })
                  }
                  disabled={user !== null && user.username === msgUser.username}
                >
                  {msgUser ? msgUser.nickname : msgUser.nickname} {" :"}
                </button>
                {message.content}
              </div>
            );
          return;
        })}
        <p ref={bottomRef}></p>
      </div>

      <textarea
        className="room-chat-textbox"
        placeholder="time to talk"
        ref={newMessageRef}
        onKeyDown={handleEnter}
      />
      {showTimeSelector ? <TimeSelector /> : <></>}
    </div>
  );
}

export default MessagesComponent;
