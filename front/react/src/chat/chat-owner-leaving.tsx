import { FunctionComponent, useContext, useState } from "react";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";
import { UserPrivilege, UserStatus } from "./type";

export interface IChatOwnerPopupContainerProps {
  setShowPopup: Function;
}

const ChatOwnerPopupComponent: FunctionComponent<
  IChatOwnerPopupContainerProps
> = ({ setShowPopup }: { setShowPopup: Function }) => {
  const [newUser, setUser] = useState<string>("");
  const { ShowRoomSetting, actChannel } = useChat();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { socket } = useContext(SocketContext).SocketState;

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleChangeSelect = (event) => {
    console.log(event.target.value);
    setUser(event.target.value);
  };

  const handleValidate = () => {
    console.log("change owner and leave: ", newUser);
    if (!newUser || newUser.length === 0) {
      setErrorMsg("select a User");
      return;
    }
    socket.emit("UpdateUserPrivilege", {
      roomId: ShowRoomSetting.channel.id,
      privilege: UserPrivilege.owner,
      time: null,
      toModifie: newUser,
    });
    socket.emit("LeaveRoom", { roomId: ShowRoomSetting.channel.id });
    setShowPopup(false);
  };

  return (
    <>
      <div className="popup-container">
        <div className="popup-popup">
          <p>Choose a new owner:</p>
          {errorMsg.length !== 0 ? (
            <p className="time-selector-popup-error">{errorMsg}</p>
          ) : (
            <></>
          )}
          <select
            onChange={handleChangeSelect}
            value={newUser}
            name="New Owner"
            id="owner-select"
            className="create-join-menu-input"
          >
            <option value=""></option>
            {ShowRoomSetting.user.map((user, id) => {
              if (
                user.status === UserStatus.connected &&
                user.privilege !== UserPrivilege.ban &&
                user.username !== window.sessionStorage.getItem("username")
              )
                return (
                  <option key={id} value={user.username}>
                    {user.username}
                  </option>
                );
              return;
            })}
          </select>
          <button onClick={handleCancel} className="time-selector-popup-button">
            cancel
          </button>
          <button
            onClick={handleValidate}
            className="time-selector-popup-button"
          >
            validate
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatOwnerPopupComponent;
