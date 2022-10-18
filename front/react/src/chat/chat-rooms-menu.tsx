import { useContext, useState } from "react";
import { FaAngleRight, FaBan, FaLock } from "react-icons/fa";
import { GiAlienStare, GiAstronautHelmet } from "react-icons/gi";
import { TbMessageCircleOff } from "react-icons/tb";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { useChat } from "../context/chat.context";
import { IoIosAddCircle } from "react-icons/io";
import { MdPersonRemove } from "react-icons/md";
import { ChannelType, User, UserPrivilege } from "./type";
import { SiStarship } from "react-icons/si";
import SocketContext from "../context/socket.context";

function RoomsMenuContainer() {
  const [searchFriend, setSearchFriend] = useState<string>("");
  const [newFriend, setNewFriend] = useState<string>("");
  const [newBlock, setNewBlock] = useState<string>("");
  const { socket } = useContext(SocketContext).SocketState;
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
    user,
    showChannel,
    setShowChannel,
    setShowBloqued,
    showBloqued,
    showFriend,
    setShowFriend,
    friendList,
    bloquedList,
  } = useChat();

  function handleJoinRoom(key: string) {
    console.log("try to join:", key);
    setSelectUser(undefined);
    if (key === actChannel) return;
    setActChannel(key);
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

  const handleShowUser = (user: User) => {
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

  const handleShowChannel = (event) => {
    showChannel ? setShowChannel(false) : setShowChannel(true);
  };

  const handleShowFriend = (event) => {
    showFriend ? setShowFriend(false) : setShowFriend(true);
  };

  const handleShowBloqued = (event) => {
    showBloqued ? setShowBloqued(false) : setShowBloqued(true);
  };

  const handleAddFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(newFriend);
    socket.emit("AddFriend", { newFriend });
  };

  const handleAddBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(newBlock);
    socket.emit("AddBlock", { newBlock });
  };

  const handleChangeNewFriend = (event) => {
    setNewFriend(event.target.value);
  };

  const handleChangeNewBlock = (event) => {
    setNewBlock(event.target.value);
  };

  const handleRemoveFriend = (username) => {
    socket.emit("RemoveFriend", { username });
  };

  const handleRemoveBlock = (username) => {
    socket.emit("RemoveBlock", { username });
  };

  return (
    <nav className="room-menu">
      <div className="room-menu-search-channel-container">
        <button className="room-menu-close-button" onClick={handleShowRoomMenu}>
          <FaAngleRight />
        </button>
      </div>

      <div>
        <button
          onClick={handleShowFriend}
          className="room-menu-button-scroll-menu"
        >
          Friend{" "}
          {showFriend ? (
            <RiArrowDropUpFill className="room-menu-button-scroll-menu-icon" />
          ) : (
            <RiArrowDropDownFill className="room-menu-button-scroll-menu-icon" />
          )}
        </button>
        {showFriend ? (
          <>
            <form>
              <input
                value={newFriend}
                onChange={handleChangeNewFriend}
                placeholder="add new friend"
                className="room-menu-input-search-block-friend"
              />
              <button
                onClick={handleAddFriend}
                className="room-menu-button-add-friend-block"
              >
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              {friendList.map((friend, id) => {
                if (!friend.nickname.search(newFriend)) {
                  return (
                    <li key={id}>
                      <button className="room-menu-button-user-block-friend">
                        {friend.nickname}
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveFriend(friend.username);
                        }}
                        className="room-menu-button-remove-user"
                      >
                        <MdPersonRemove />
                      </button>
                    </li>
                  );
                }
                return;
              })}
            </ul>
          </>
        ) : (
          <></>
        )}
      </div>

      <div>
        <button
          onClick={handleShowChannel}
          className="room-menu-button-scroll-menu"
        >
          Channel{" "}
          {showChannel ? (
            <RiArrowDropUpFill className="room-menu-button-scroll-menu-icon" />
          ) : (
            <RiArrowDropDownFill className="room-menu-button-scroll-menu-icon" />
          )}
        </button>
        {showChannel ? (
          <div className="room-menu-room-list-container">
            <input
              value={searchChannel}
              onChange={handleSearchChannel}
              placeholder="looking for channel?"
              className="room-menu-input-channel"
            />
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
                          {room.user.map((actUser, id) => {
                            //searchFriend.current.value = "";
                            if (!actUser.nickname.search(searchFriend))
                              return (
                                <li key={id}>
                                  <button
                                    className="room-menu-button-user"
                                    onClick={() => {
                                      handleShowUser(actUser);
                                    }}
                                    disabled={
                                      user.username === actUser.username
                                    }
                                  >
                                    {actUser.privilege ===
                                    UserPrivilege.admin ? (
                                      <GiAlienStare className="room-menu-user-icon" />
                                    ) : (
                                      <></>
                                    )}
                                    {actUser.privilege ===
                                    UserPrivilege.owner ? (
                                      <SiStarship className="room-menu-user-icon" />
                                    ) : (
                                      <></>
                                    )}
                                    {actUser.privilege === UserPrivilege.ban ? (
                                      <FaBan className="room-menu-user-icon" />
                                    ) : (
                                      <></>
                                    )}
                                    {actUser.privilege ===
                                    UserPrivilege.muted ? (
                                      <>
                                        <TbMessageCircleOff className="room-menu-user-icon" />
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {actUser.privilege ===
                                    UserPrivilege.default ? (
                                      <>
                                        <GiAstronautHelmet className="room-menu-user-icon" />
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {actUser.nickname}
                                  </button>
                                </li>
                              );
                            return <></>;
                          })}
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              return <></>;
            })}
          </div>
        ) : (
          <></>
        )}
      </div>

      <div>
        <button
          onClick={handleShowBloqued}
          className="room-menu-button-scroll-menu"
        >
          Bloqued{" "}
          {showBloqued ? (
            <RiArrowDropUpFill className="room-menu-button-scroll-menu-icon" />
          ) : (
            <RiArrowDropDownFill className="room-menu-button-scroll-menu-icon" />
          )}
        </button>
        {showBloqued ? (
          <>
            <form>
              <input
                value={newBlock}
                onChange={handleChangeNewBlock}
                placeholder="ignore someone"
                className="room-menu-input-search-block-friend"
              />
              <button
                onClick={handleAddBlock}
                className="room-menu-button-add-friend-block"
              >
                <IoIosAddCircle />
              </button>
            </form>
            <ul>
              {bloquedList.map((block, id) => {
                if (!block.nickname.search(newBlock)) {
                  return (
                    <li key={id}>
                      <button className="room-menu-button-user-block-friend">
                        {block.nickname}
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveBlock(block.username);
                        }}
                        className="room-menu-button-remove-user"
                      >
                        <MdPersonRemove />
                      </button>
                    </li>
                  );
                }
                return;
              })}
            </ul>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}

export default RoomsMenuContainer;
