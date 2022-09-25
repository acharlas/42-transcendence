import { FaAngleRight, FaLock } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { useChat } from "../context/chat.context";
import { ChannelType } from "./type";

function RoomsMenuContainer({}) {
  const {} = useChat();
  const { rooms, showRoomMenu, setShowRoomMenu, actChannel } = useChat();

  function handleJoinRoom(key: string) {
    // console.log("try to join:", key);
    // if (key === roomId) return;
    // setRoomId(key);
    // rooms.map((room) => {
    //   console.log("channel id:", room.channel.id);
    // });
    // const curRoom = rooms.find((room) => {
    //   if (room.channel.id === key) return true;
    //   return false;
    // });
    // console.log(curRoom, curRoom.message, curRoom.user);
    // setRoomShow(curRoom);
    // console.log(curRoom, curRoom.message, curRoom.user);
    // setMessages(curRoom.message);
    // setUserList(curRoom.user);
    // showRoom ? setShowRoom(false) : "";
    // setShowUser(null);
  }

  const handleShowRoomMenu = (event) => {
    showRoomMenu ? setShowRoomMenu(false) : setShowRoomMenu(true);
  };

  // const handleShowCreateRoom = (event) => {
  //   if (roomId) {
  //     setRoomId("");
  //   }
  //   setJoinNewRoom(false);
  //   setShowUser(null);
  //   showRoom ? setShowRoom(false) : "";
  // };

  const handleJoinNewRoom = (event) => {
    // setJoinNewRoom(true);
    // setShowUser(null);
    // setRoomId("");
    // showRoom ? setShowRoom(false) : "";
  };

  return (
    <nav className="room-menu">
      <div>
        <button className="create-room-button-menu" onClick={undefined}>
          create room
        </button>
        <button className="room-button" onClick={handleShowRoomMenu}>
          <FaAngleRight />
        </button>
      </div>
      <div>
        <button onClick={undefined}>join Room</button>
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
