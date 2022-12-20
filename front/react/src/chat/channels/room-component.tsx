import { useContext, useEffect, useRef } from "react";
import { HiPlusSm, HiXCircle } from "react-icons/hi";

import "../chat-style.css";
import { ChannelType, User, UserPrivilege } from "../type";
import UserMenu from "./chat-user-menu";
import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import TimeSelector from "./chat-time-selector";
import InviteUser from "./chat-invite-user";
import ChannelSettingsComponent from "./channel-settings-component";

function MessagesComponent() {
  const newMessageRef = useRef(null);
  const bottomRef = useRef(null);
  const {
    rooms,
    messages,
    actChannel,
    userList,
    setSelectUser,
    selectUser,
    user,
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

  const room = rooms.find((room) => { return (room.channel.id === actChannel); });
  const affInvite = (): boolean => {
    return (room &&
      room.channel.type === ChannelType.private &&
      (user.privilege === UserPrivilege.admin ||
        user.privilege === UserPrivilege.owner)
    );
  };
  const affSettings = (): boolean => {
    return (room &&
      room.channel.type !== ChannelType.dm &&
      (user.privilege === UserPrivilege.admin ||
        user.privilege === UserPrivilege.owner)
    );
  };
  const getChannelName = (): string => {
    return (room?.channel?.name || "Chat");
  }


  if (!actChannel) return <></>;
  return (<>
    <div className="profile__panel__top">
      {getChannelName()}
    </div>
    <div className="profile__panel__bottom">
      {selectUser && <UserMenu />}
      <div className="room-chat-message-container">
        {messages.map((message, index) => {
          const msgUser = userList.find((user) => {
            return (user.username === message.username);
          });
          if (
            !bloquedList.find((bloque) => {
              return (bloque.username === message.username);
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
          return null;
        })}
        <p ref={bottomRef}></p>
      </div>

      <textarea
        className="room-chat-textbox"
        placeholder="message channel"
        ref={newMessageRef}
        onKeyDown={handleEnter}
      />
      {showTimeSelector && <TimeSelector />}
    </div>
    {affSettings() && <ChannelSettingsComponent />}
    {affInvite() && <InviteUser />}
  </>);
}

export default MessagesComponent;
