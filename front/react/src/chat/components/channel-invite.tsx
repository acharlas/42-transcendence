import React from "react";
import { FunctionComponent, useContext, useRef, useState } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";

export interface IInviteUserProps { }

const ChannelInviteComponent: FunctionComponent<IInviteUserProps> = (props) => {
  const { setShowInviteUser, actChannel } = useChat();
  const { socket } = useContext(SocketContext).SocketState;
  const [errorMsg, setErrorMsg] = useState<string>("");
  const userInvite = useRef(null);

  const handleValidate = () => {
    setErrorMsg("");
    console.log("socket", socket);
    const userName = userInvite.current.value || "";

    console.log("invite user: ", userName);
    if (!String(userName).trim() && userName.length === 0) {
      setErrorMsg("enter a username");
      return;
    }

    socket.emit("InviteUser", { user: userName, channel: actChannel });
    setShowInviteUser(false);
  };

  return (<>
    <div className="profile__panel__top">
      Invite user
    </div>
    <div className="profile__panel__bottom">
      {errorMsg.length !== 0 && (
        <p className="time-selector-popup-error">{errorMsg}</p>
      )}
      <input
        ref={userInvite}
        placeholder="Username..."
      />
      <button onClick={handleValidate} className="fullwidth-button">
        invite
      </button>
    </div>
  </>);
};

export default ChannelInviteComponent;
