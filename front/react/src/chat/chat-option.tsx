import { FunctionComponent, useContext, useRef, useState } from "react";
import { HiXCircle } from "react-icons/hi";
import { useChat } from "../context/chat.context";
import SocketContext from "../context/socket.context";
import { Channel, ChannelType, Room } from "./type";

export interface IChatOptionProps {}

interface iUpdateChannelDto {
  name?: string;
  type?: ChannelType;
  password?: string;
}

const ChatOptionComponent: FunctionComponent<IChatOptionProps> = (props) => {
  const newPassword = useRef(null);
  const [type, setType] = useState<ChannelType>(ChannelType.public);
  const { socket } = useContext(SocketContext).SocketState;
  const { setShowRoomSetting, ShowRoomSetting } = useChat();
  const [errMsg, seterrMsg] = useState<string>("");
  const newRoomRef = useRef(null);

  function handleUpdateRoom() {
    const roomName = newRoomRef.current.value || "";
    let password: string;
    let updateChannelDto: iUpdateChannelDto = {
      name: undefined,
      password: undefined,
      type: undefined,
    };

    if (newPassword.current) password = newPassword.current.value || "";
    else password = null;

    console.log("create room", roomName, password);
    if (String(roomName).trim()) updateChannelDto.name = roomName;

    if (type !== ShowRoomSetting.channel.type) {
      if (type === ChannelType.protected && !password) {
        seterrMsg("protected room must have a password");
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
        seterrMsg("protected room must have a password");
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

  const handleCloseMenu = (event) => {
    setShowRoomSetting(false);
  };

  return (
    <>
      <div className="chat-box-container">
        <div className="room-chat-option">
          <button onClick={handleCloseMenu} className="chat-box-button">
            <HiXCircle className="chat-box-button-icon" />
          </button>
        </div>
        <form className="create-join-menu-title">
          Room Name:
          <input
            ref={newRoomRef}
            placeholder="Room name..."
            className="create-join-menu-input"
          />
          <p />
          Room Type:
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
          {type === ChannelType.protected ? (
            <>
              <p />
              Password:
              <input
                ref={newPassword}
                placeholder="Password optional..."
                className="create-join-menu-input"
              />
            </>
          ) : (
            <></>
          )}
        </form>
        <button className="create-join-menu-button" onClick={handleUpdateRoom}>
          updateRoom
        </button>
      </div>
    </>
  );
};

export default ChatOptionComponent;
