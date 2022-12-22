import { FunctionComponent, useContext, useRef, useState } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import ChatOwnerPopupComponent from "./channel-owner-leaving";
import { ChannelType, UserStatus } from "../type";
import { IChatOptionProps } from "./channel-settings";


const ChannelSettings: FunctionComponent<IChatOptionProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const {
    actChannel,
    setActChannel,
  } = useChat();

  const handleLeaveRoom = (event) => {
    socket.emit("LeaveRoom", { roomId: actChannel });
    setActChannel(null);
    return;
  };

  return (<>
    <div className="profile__panel__top">
      Channel settings
    </div>
    <div className="profile__panel__bottom">
      <button className="fullwidth-button" onClick={handleLeaveRoom}>
        {"Leave Room"}
      </button>
    </div>
  </>);
};

export default ChannelSettings;
