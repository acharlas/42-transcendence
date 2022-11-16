import "./chat-style.css";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { FunctionComponent, useState } from "react";
import { useChat } from "../context/chat.context";
import RoomsMenuContainer from "./chat-rooms-menu";
import MessagesComponent from "./chat-messages";
import CreateRoomsContainer from "./chat-create-room";
import JoinNewRoomComponent from "./chat-join-new-room";
import ChatOptionComponent from "./chat-option";

export interface IChatIndexProps {}

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  const {
    rooms,
    selectUser,
    actChannel,
    showCreateMenu,
    showJoinMenu,
    ShowRoomSetting,
    setShowChat,
    showChat,
  } = useChat();

  const handleShow = () => {
    setShowChat(true);
  };

  if (rooms) console.log("rooms at start:", rooms, "userselect: ", selectUser);
  return (
    <>
      {showChat ? (
        <>
          <div className="chat-container">
            <RoomsMenuContainer setShow={setShowChat} />
          </div>
          <div>
            {actChannel ? (
              <div>
                <MessagesComponent />
              </div>
            ) : (
              <></>
            )}
            {showCreateMenu ? <CreateRoomsContainer /> : <></>}
            {showJoinMenu ? <JoinNewRoomComponent /> : <></>}
            {ShowRoomSetting ? <ChatOptionComponent /> : <></>}
          </div>
        </>
      ) : (
        <>
          <button onClick={handleShow} className="menu-user-button">
            <BsFillChatRightTextFill className="menu-user-icon" />
          </button>
        </>
      )}
    </>
  );
};

export default ChatIndex;