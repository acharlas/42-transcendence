import React from "react";
import { FunctionComponent, useContext, useRef, useState } from "react";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";

export interface IInviteUserProps {}

const InviteUser: FunctionComponent<IInviteUserProps> = (props) => {
  const { setShowInviteUser, actChannel } = useChat();
  const { socket } = useContext(SocketContext).SocketState;
  const [errorMsg, setErrorMsg] = useState<string>("");
  const userInvite = useRef(null);

  const handleCancel = () => {
    setShowInviteUser(false);
  };

  const handleValidate = () => {
    console.log("socket", socket);
    const userName = userInvite.current.value || "";

    console.log("invite user: ", userName);
    if (!String(userName).trim()) return;

    socket.emit("InviteUser", { user: userName, channel: actChannel });
    setShowInviteUser(false);
  };

  return (
    <div className="popup-container">
      <div className="popup-popup">
        <p className="time-selector-popup-title">User to Invite</p>
        {errorMsg.length !== 0 ? (
          <p className="time-selector-popup-error">{errorMsg}</p>
        ) : (
          <></>
        )}
        <input
          ref={userInvite}
          placeholder="Username..."
          className="time-selector-popup-input"
        />
        <button onClick={handleCancel} className="time-selector-popup-button">
          cancel
        </button>
        <button onClick={handleValidate} className="time-selector-popup-button">
          validate
        </button>
      </div>
    </div>
  );
};

export default InviteUser;
