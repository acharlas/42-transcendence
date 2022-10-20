import "./chat-style.css";
import { useNavigate } from "react-router-dom";
import { FunctionComponent } from "react";
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
  } = useChat();

  if (rooms) console.log("rooms at start:", rooms, "userselect: ", selectUser);
  return (
    <>
      <div className="chat-container">
        <RoomsMenuContainer />
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
  );
};

export default ChatIndex;
