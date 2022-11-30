import "./chat-style.css";
import { FunctionComponent } from "react";
import { useChat } from "../context/chat.context";
import RoomsMenuContainer from "./chat-rooms-menu";
import MessagesComponent from "./chat-messages";
import CreateRoomsContainer from "./chat-create-room";
import JoinNewRoomComponent from "./chat-join-new-room";
import ChatOptionComponent from "./chat-option";
import { MdMarkChatRead, MdMarkChatUnread } from "react-icons/md";

export interface IChatIndexProps {}

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  const {
    rooms,
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
            {rooms.find((room) => {
              if (room.newMessage) return true;
              return false;
            }) ? (
              <MdMarkChatUnread className="menu-user-icon" />
            ) : (
              <MdMarkChatRead className="menu-user-icon" />
            )}
          </button>
        </>
      )}
    </>
  );
};

export default ChatIndex;
