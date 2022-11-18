import { useContext, useState } from "react";
import { FaBan, FaLock } from "react-icons/fa";
import { GiAlienStare, GiAstronautHelmet } from "react-icons/gi";
import { TbMessageCircleOff } from "react-icons/tb";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { useChat } from "../context/chat.context";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";
import { MdPersonRemove } from "react-icons/md";
import { ChannelType, Room, User, UserPrivilege, UserStatus } from "./type";
import { SiStarship } from "react-icons/si";
import SocketContext from "../context/socket.context";
import { HiXCircle } from "react-icons/hi";
import { BiMessageAltAdd } from "react-icons/bi";
import { ErrMessage } from "./chat-error-msg";

function RoomsMenuContainer({ setShow }: { setShow: Function }) {
  const [searchFriend, setSearchFriend] = useState<string>("");
  const [newFriend, setNewFriend] = useState<string>("");
  const [newBlock, setNewBlock] = useState<string>("");
  const { socket } = useContext(SocketContext).SocketState;
  const [searchChannel, setSearchChannel] = useState<string>("");
  const {
    rooms,
    actChannel,
    showCreateMenu,
    setShowCreateMenu,
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
    setShowJoinMenu,
    showJoinMenu,
    setShowRoomSetting,
    showDm,
    setShowDm,
    closeChatBox,
    setNewRoom,
    FriendErrMsg,
    BlockErrMsg,
  } = useChat();

  function handleJoinRoom(key: string) {
    console.log("try to join:", key);
    if (key === actChannel) return;
    closeChatBox();
    const curRoom = rooms.find((room) => {
      if (room.channel.id === key) return true;
      return false;
    });
    curRoom.newMessage = false;
    setNewRoom(curRoom);
    console.log("user set to: ", user);
  }

  const handleShowRoomMenu = (event) => {
    setShow(false);
  };

  const handleShowCreateRoom = (event) => {
    closeChatBox();
    setShowCreateMenu(true);
  };

  const handleJoinNewRoom = (event) => {
    closeChatBox();
    setShowJoinMenu(true);
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

  const handleShowRoomSetting = (room: Room) => {
    closeChatBox();
    setShowRoomSetting(room);
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

  const handleRemoveFriend = (username: string) => {
    socket.emit("RemoveFriend", { username });
  };

  const handleRemoveBlock = (username: string) => {
    socket.emit("RemoveBlock", { username });
  };

  const handleLeaveChannel = (roomId: string) => {
    console.log("leave room: ", roomId);
    socket.emit("LeaveRoom", { roomId });
  };

  const handleShowDm = () => {
    showDm ? setShowDm(false) : setShowDm(true);
  };

  const handleSendDm = (username: string) => {
    const chan = rooms.find((room) => {
      const u = room.user.find((usr) => {
        if (usr.username === window.sessionStorage.getItem("username"))
          return true;
        return false;
      });
      const u2 = room.user.find((usr) => {
        if (usr.username === username) return true;
        return false;
      });
      if (room.channel.type === ChannelType.dm && u && u2) return true;
      return false;
    });
    if (!chan) {
      socket.emit("Dm", { sendTo: username });
      return;
    }
    closeChatBox();
    setNewRoom(chan);
  };

  function menuElemFriendlist() {
    return (
      <div>
        <button
          onClick={handleShowFriend}
          className="room-menu-button-scroll-menu"
        >
          Friendlist{" "}
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
            {FriendErrMsg ? <p>{FriendErrMsg}</p> : <></>}
            <ul>
              {friendList.map((friend, id) => {
                if (!friend.nickname.search(newFriend)) {
                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          handleSendDm(friend.username);
                        }}
                        className="room-menu-button-user-block-friend"
                      >
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
    );
  }

  function menuElemBlocklist() {
    return (
      <div>
        <button
          onClick={handleShowBloqued}
          className="room-menu-button-scroll-menu"
        >
          Blocklist{" "}
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
            {BlockErrMsg ? <p>{BlockErrMsg}</p> : <></>}
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
    );
  }

  function menuElemChannels() {
    return (
      <div>
        <button
          onClick={handleShowChannel}
          className="room-menu-button-scroll-menu"
        >
          Channels{" "}
          {rooms.find((room) => {
            if (room.channel.type !== ChannelType.dm && room.newMessage)
              return true;
            return false;
          }) && <BiMessageAltAdd />}
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
              disabled={actChannel === null && showJoinMenu === true}
            >
              join
            </button>
            {rooms ? (
              rooms.map((room, id) => {
                if (room.channel.type === ChannelType.dm) return;
                const channel = room.channel;
                const chanUser = room.user.find((chanUser) => {
                  if (
                    chanUser.username ===
                    window.sessionStorage.getItem("username")
                  )
                    return true;
                  return false;
                });
                if (!room.channel.name.search(searchChannel))
                  return (
                    <div key={id}>
                      <button
                        className="room-menu-button-join-room"
                        disabled={
                          channel.id === actChannel ||
                          (user && user.privilege === UserPrivilege.ban)
                        }
                        title={`Join ${channel.name}`}
                        onClick={() => handleJoinRoom(channel.id)}
                      >
                        {channel.type === ChannelType.protected ? (
                          <FaLock />
                        ) : (
                          ""
                        )}
                        {channel.name}
                        {room.newMessage && <BiMessageAltAdd />}
                      </button>
                      {chanUser.privilege === UserPrivilege.owner ? (
                        <button
                          onClick={() => {
                            handleShowRoomSetting(room);
                          }}
                        >
                          <AiFillSetting />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleLeaveChannel(room.channel.id);
                          }}
                        >
                          <HiXCircle />
                        </button>
                      )}
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
                              if (
                                !actUser.nickname.search(searchFriend) &&
                                (actUser.status !== UserStatus.disconnected ||
                                  actUser.privilege === UserPrivilege.ban)
                              )
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
                                        UserPrivilege.admin && (
                                        <GiAlienStare className="room-menu-user-icon" />
                                      )}
                                      {actUser.privilege ===
                                        UserPrivilege.owner && (
                                        <SiStarship className="room-menu-user-icon" />
                                      )}
                                      {actUser.privilege ===
                                        UserPrivilege.ban && (
                                        <FaBan className="room-menu-user-icon" />
                                      )}
                                      {actUser.privilege ===
                                        UserPrivilege.muted && (
                                        <TbMessageCircleOff className="room-menu-user-icon" />
                                      )}
                                      {actUser.privilege ===
                                        UserPrivilege.default && (
                                        <GiAstronautHelmet className="room-menu-user-icon" />
                                      )}
                                      {actUser.nickname}
                                    </button>
                                  </li>
                                );
                              return;
                            })}
                          </ul>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                return <></>;
              })
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  function menuElemMessages() {
    return (
      <div>
        <button onClick={handleShowDm} className="room-menu-button-scroll-menu">
          Private Messages{" "}
          {rooms.find((room) => {
            if (room.channel.type === ChannelType.dm && room.newMessage)
              return true;
            return false;
          }) && <BiMessageAltAdd />}
          {showDm ? (
            <RiArrowDropUpFill className="room-menu-button-scroll-menu-icon" />
          ) : (
            <RiArrowDropDownFill className="room-menu-button-scroll-menu-icon" />
          )}
        </button>
        {showDm ? (
          <>
            {rooms.map((room, id) => {
              const usr = room.user.find((usr) => {
                if (usr.username !== window.sessionStorage.getItem("username"))
                  return true;
                return false;
              });
              if (
                room.channel.type !== ChannelType.dm ||
                bloquedList.find((block) => {
                  if (block.username === usr.username) return true;
                  return false;
                })
              )
                return; //dead code
              return (
                <div key={id}>
                  <button
                    title={`Join ${room.channel.name}`}
                    onClick={() => handleJoinRoom(room.channel.id)}
                    className="room-menu-button-dm"
                  >
                    {
                      room.user.find((usr) => {
                        if (
                          usr.username !==
                          window.sessionStorage.getItem("username")
                        )
                          return true;
                        return false;
                      }).username
                    }
                    {room.newMessage && <BiMessageAltAdd />}
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }

  return (
    <nav className="room-menu">
      <div className="room-menu-search-channel-container">
        <button className="room-menu-close-button" onClick={handleShowRoomMenu}>
          <HiXCircle />
        </button>
      </div>
      {menuElemFriendlist()}
      {menuElemBlocklist()}
      {menuElemChannels()}
      {menuElemMessages()}
    </nav>
  );
}

export default RoomsMenuContainer;
