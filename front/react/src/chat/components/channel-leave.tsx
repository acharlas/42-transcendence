import { FunctionComponent, useContext } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import { IChatOptionProps } from "./channel-settings";

//Leave button when user doesn't have settings privileges

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
