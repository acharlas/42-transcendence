import { FunctionComponent, useContext, useRef, useState } from "react";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import ChannelOwnerLeavingComponent from "./channel-owner-leaving";
import { ChannelType, UserStatus } from "../type";

export interface IChatOptionProps { }

interface iUpdateChannelDto {
  name?: string;
  type?: ChannelType;
  password?: string;
}

const ChannelSettingsComponent: FunctionComponent<IChatOptionProps> = (props) => {
  const newPassword = useRef(null);
  const [type, setType] = useState<ChannelType>(ChannelType.public);
  const { socket } = useContext(SocketContext).SocketState;
  const {
    setShowRoomSetting,
    ShowRoomSetting,
    CreateErrMsg,
    setCreateErrMsg,
  } = useChat();
  const newRoomRef = useRef(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  function handleUpdateRoom() {
    const roomName = newRoomRef.current.value || "";
    let password: string;
    let updateChannelDto: iUpdateChannelDto = {
      name: undefined,
      password: undefined,
      type: undefined,
    };

    setCreateErrMsg("");
    if (newPassword.current) password = newPassword.current.value || "";
    else password = null;

    console.log("create room", roomName, password);
    if (String(roomName).trim()) updateChannelDto.name = roomName;

    if (type !== ShowRoomSetting.channel.type) {
      if (type === ChannelType.protected && !password) {
        setCreateErrMsg("a protected room needs a password");
        return;
      } else {
        updateChannelDto.password = password;
      }
      updateChannelDto.type = type;
    } else if (
      type === ChannelType.protected &&
      ShowRoomSetting.channel.type === ChannelType.protected
    ) {
      if (!password) {
        setCreateErrMsg("a protected room needs a password");
        return;
      }
      updateChannelDto.type = ChannelType.protected;
      updateChannelDto.password = password;
    }

    if (updateChannelDto.name || updateChannelDto.type)
      console.log("sending update room: ", { updateChannelDto });
    socket.emit("UpdateRoom", {
      roomId: ShowRoomSetting.channel.id,
      updateChannelDto,
    });
    if (newRoomRef.current) newRoomRef.current.value = "";
    if (newPassword.current) newPassword.current.value = "";
  }

  const handleChangeSelect = (event) => {
    console.log(event.target.value);
    setType(event.target.value);
    if (event.target.value !== "protected" && newPassword.current)
      newPassword.current.value = "";
  };

  const handleLeaveRoom = (event) => {
    const u = ShowRoomSetting.user.filter((user) => {
      if (user.status === UserStatus.disconnected) return false;
      return true;
    });
    console.log(u);
    if (u.length === 1) {
      socket.emit("LeaveRoom", { roomId: ShowRoomSetting.channel.id });
      setShowRoomSetting(null);
      return;
    }
    setShowPopup(true);
  };

  return (<>
    <div className="profile__panel__top">
      Channel settings
    </div>
    <div className="profile__panel__bottom">
      <form className="create-join-menu-title">
        {CreateErrMsg && (
          <p className="room-chat-err-message">{CreateErrMsg}</p>
        )}
        <p>Name:</p>
        <input
          ref={newRoomRef}
          placeholder="New name..."
          className="create-join-menu-input"
        />
        <p>Room Type:</p>
        <select
          onChange={handleChangeSelect}
          value={type}
          name="channel type"
          id="channel-select"
          className="create-join-menu-input"
        >
          <option value={ChannelType.public}>public</option>
          <option value={ChannelType.protected}>protected</option>
          <option value={ChannelType.private}>private</option>
        </select>
        {type === ChannelType.protected && (
          <>
            Password:
            <input
              ref={newPassword}
              placeholder="Password..."
              className="create-join-menu-input"
            />
          </>
        )}
      </form>
      <button className="fullwidth-button" onClick={handleUpdateRoom}>
        {"Update Room"}
      </button>
      <button className="fullwidth-button" onClick={handleLeaveRoom}>
        {"Leave Room"}
      </button>
      {showPopup && (
        <ChannelOwnerLeavingComponent setShowPopup={setShowPopup} />
      )}
    </div>
  </>);
};

export default ChannelSettingsComponent;
