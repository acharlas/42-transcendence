import { FaAngleRight, FaLock } from "react-icons/fa";
import { useChat } from "../context/chat.context";
import { ChannelType } from "./type";

function RoomsMenuContainer({}) {
  const {} = useChat();
  const {
    rooms,
    showRoomMenu,
    setShowRoomMenu,
    setActChannel,
    actChannel,
    setMessages,
    setUserList,
    showCreateMenu,
    setShowCreateMenu,
    setUser,
    setSelectUser,
  } = useChat();

  function handleJoinRoom(key: string) {
    console.log("try to join:", key);
    setSelectUser(undefined);
    if (key === actChannel) return;
    setActChannel(key);
    rooms.map((room) => {
      console.log("channel id:", room.channel.id);
    });
    const curRoom = rooms.find((room) => {
      if (room.channel.id === key) return true;
      return false;
    });
    console.log(curRoom, curRoom.message, curRoom.user);
    setMessages(curRoom.message);
    console.log(curRoom, curRoom.message, curRoom.user);
    setMessages(curRoom.message);
    setUserList(curRoom.user);
    const user = curRoom.user.find((user) => {
      if (user.username === window.sessionStorage.getItem("username"))
        return true;
      return false;
    });
    setUser(user);
    console.log("user set to: ", user);
    setShowRoomMenu(false);
  }

  const handleShowRoomMenu = (event) => {
    showRoomMenu ? setShowRoomMenu(false) : setShowRoomMenu(true);
  };

  const handleShowCreateRoom = (event) => {
    setActChannel(null);
    setShowRoomMenu(false);
    setShowCreateMenu(true);
    setSelectUser(undefined);
    setMessages([]);
    setUserList([]);
  };

  const handleJoinNewRoom = (event) => {
    setActChannel(null);
    setShowRoomMenu(false);
    setShowCreateMenu(false);
    setSelectUser(undefined);
    setMessages([]);
    setUserList([]);
  };

  return (
    <nav className="room-menu">
      <div>
        <button
          className="create-room-button-menu"
          onClick={handleShowCreateRoom}
          disabled={actChannel === null && showCreateMenu}
        >
          create room
        </button>
        <button className="room-button" onClick={handleShowRoomMenu}>
          <FaAngleRight />
        </button>
      </div>
      <div>
        <button
          onClick={handleJoinNewRoom}
          disabled={actChannel === null && showCreateMenu === false}
        >
          join Room
        </button>
      </div>
      {rooms.map((room, id) => {
        const channel = room.channel;
        return (
          <div key={id}>
            <button
              className="join-room-button"
              disabled={channel.id === actChannel}
              title={`Join ${channel.name}`}
              onClick={() => handleJoinRoom(channel.id)}
            >
              {channel.type === ChannelType.protected ? <FaLock /> : ""}
              {channel.name}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

export default RoomsMenuContainer;
