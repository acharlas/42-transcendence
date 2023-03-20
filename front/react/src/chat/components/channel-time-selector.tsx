import { FunctionComponent, useContext, useRef, useState } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";

export interface ItimeSelectorProps {}

// Selects endtime for mutes and bans

const TimeSelectorComponent: FunctionComponent<ItimeSelectorProps> = (props) => {
  const { setShowTimeSelector, showTimeSelector, actChannel, selectUser, setSelectUser } = useChat();
  const { socket } = useContext(SocketContext).SocketState;
  const [errorMsg, setErrorMsg] = useState<string>("");
  const newDateRef = useRef(null);

  const handleCancel = () => {
    setShowTimeSelector(undefined);
  };

  const handleValidate = () => {
    const date: string = newDateRef.current.value || "";
    //console.log(newDateRef.current.value);
    if (!date) {
      setErrorMsg("date format must be mm/dd/yy hour:min AM/PM");
      return;
    }

    const ate = new Date(date);
    //console.log(ate);
    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: showTimeSelector,
      time: ate,
      toModifie: selectUser.username,
    });
    setSelectUser(undefined);
    setShowTimeSelector(undefined);
  };

  return (
    <>
      <p className="">until:</p>
      {errorMsg.length !== 0 && <p className="time-selector-popup-error">{errorMsg}</p>}
      <input type="datetime-local" name="time" ref={newDateRef} className="time-selector-popup-input" />
      <button onClick={handleValidate} className="fullwidth-button">
        validate
      </button>
      <button onClick={handleCancel} className="fullwidth-button">
        cancel
      </button>
    </>
  );
};

export default TimeSelectorComponent;
