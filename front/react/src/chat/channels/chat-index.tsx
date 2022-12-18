import { FunctionComponent } from "react";
// import { MdMarkChatRead, MdMarkChatUnread } from "react-icons/md";

import "../chat-style.css";
import { useChat } from "../../context/chat.context";
import RoomsMenuContainer from "../chat-rooms-menu";
import MessagesComponent from "./chat-messages";
import CreateRoomsContainer from "./chat-create-room";
import JoinNewRoomComponent from "./chat-join-new-room";
import ChatOptionComponent from "./chat-option";

export interface IChatIndexProps {}

const ChatIndex: FunctionComponent<IChatIndexProps> = (props) => {
  const {
    actChannel,
    showCreateMenu,
    showJoinMenu,
    ShowRoomSetting,
  } = useChat();

  return (
    <>
      <RoomsMenuContainer />
        <div>
          {actChannel && (
            <div>
              <MessagesComponent />
            </div>
          )}
          {showCreateMenu && <CreateRoomsContainer />}
          {showJoinMenu && <JoinNewRoomComponent />}
          {ShowRoomSetting && <ChatOptionComponent />}
        </div>
      {/* <button onClick={handleShow} className="menu-user-button">
        {rooms.find((room) => {
          if (room.newMessage) return true;
          return false;
        }) ? (
          <MdMarkChatUnread className="menu-user-icon" />
        ) : (
          <MdMarkChatRead className="menu-user-icon" />
        )}
      </button> */}
    </>
  );
};

export default ChatIndex;
