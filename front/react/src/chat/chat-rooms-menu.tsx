import { useRef, useState } from "react";
import { FaAngleRight, FaBan, FaLock, FaUserAstronaut } from "react-icons/fa";
import { GiAlienStare, GiAstronautHelmet } from "react-icons/gi";
import { TbMessageCircleOff } from "react-icons/tb";
import { useChat } from "../context/chat.context";
import { ChannelType, User, UserPrivilege } from "./type";
import { SiStarship } from "react-icons/si";

function RoomsMenuContainer({}) {
  const {} = useChat();
  const [searchFriend, setSearchFriend] = useState<string>("");
  const [searchChannel, setSearchChannel] = useState<string>("");
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
    selectUser,
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

  const handleShowUser = ({ user }: { user: User }) => {
    if (selectUser && selectUser.username === user.username)
      setSelectUser(undefined);
    else setSelectUser(user);
  };

  const handleSearchFriend = (event) => {
    setSearchFriend(event.target.value);
  };

  const handleSearchChannel = (event) => {
    setSearchChannel(event.target.value);
  };

  return (
    <nav className="room-menu">
      <div className="room-menu-search-channel-container">
        <input
          value={searchChannel}
          onChange={handleSearchChannel}
          placeholder="looking for Channel?"
          className="room-menu-input-channel"
        />
        <button className="room-menu-close-button" onClick={handleShowRoomMenu}>
          <FaAngleRight />
        </button>
      </div>
      <div className="room-menu-room-list-container">
        {rooms.map((room, id) => {
          const channel = room.channel;
          if (!room.channel.name.search(searchChannel))
            return (
              <div key={id}>
                <button
                  className="room-menu-button-join-room"
                  disabled={channel.id === actChannel}
                  title={`Join ${channel.name}`}
                  onClick={() => handleJoinRoom(channel.id)}
                >
                  {channel.type === ChannelType.protected ? <FaLock /> : ""}
                  {channel.name}
                </button>
                {room.channel.id === actChannel ? (
                  <>
                    <input
                      value={searchFriend}
                      onChange={handleSearchFriend}
                      placeholder="looking for friend?"
                      className="room-menu-input-friend"
                    />
                    <ul>
                      {room.user.map((user, id) => {
                        //searchFriend.current.value = "";
                        if (!user.nickname.search(searchFriend))
                          return (
                            <li key={id}>
                              <button
                                className="room-menu-button-user"
                                onClick={() => {
                                  handleShowUser({ user });
                                }}
                              >
                                {user.privilege === UserPrivilege.admin ? (
                                  <GiAlienStare className="room-menu-user-icon" />
                                ) : (
                                  <></>
                                )}
                                {user.privilege === UserPrivilege.owner ? (
                                  <SiStarship className="room-menu-user-icon" />
                                ) : (
                                  <></>
                                )}
                                {user.privilege === UserPrivilege.ban ? (
                                  <FaBan />
                                ) : (
                                  <></>
                                )}
                                {user.privilege === UserPrivilege.muted ? (
                                  <>
                                    <TbMessageCircleOff className="room-menu-user-icon" />
                                  </>
                                ) : (
                                  <></>
                                )}
                                {user.privilege === UserPrivilege.default ? (
                                  <>
                                    <GiAstronautHelmet className="room-menu-user-icon" />
                                  </>
                                ) : (
                                  <></>
                                )}
                                {user.nickname}
                              </button>
                            </li>
                          );
                      })}
                    </ul>
                  </>
                ) : (
                  <></>
                )}
              </div>
            );
        })}
      </div>
      <div className="room-menu-join-create-container">
        <button
          className="room-menu-button-create-join"
          onClick={handleShowCreateRoom}
          disabled={actChannel === null && showCreateMenu}
        >
          create
        </button>
        <button
          className="room-menu-button-create-join"
          onClick={handleJoinNewRoom}
          disabled={actChannel === null && showCreateMenu === false}
        >
          join
        </button>
      </div>
    </nav>
  );
}

export default RoomsMenuContainer;
