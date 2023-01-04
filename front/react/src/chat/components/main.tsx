import { useContext, useState } from "react";
import { FaGlobe, FaLock, FaUserSecret } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { MdPersonRemove } from "react-icons/md";
import { BiMessageAltAdd } from "react-icons/bi";

import { SelectedChatWindow, useChat } from "../../context/chat.context";
import { ChannelType, UserPrivilege } from "../type";
import SocketContext from "../../context/socket.context";
import ChannelJoinComponent from "./channel-join";
import ChannelCreationComponent from "./channel-creation";
import RoomComponent from "./room";

function ChatMainComponent() {
  const [newFriend, setNewFriend] = useState<string>("");
  const [newBlock, setNewBlock] = useState<string>("");
  const { socket } = useContext(SocketContext).SocketState;
  const {
    selectedChatWindow,
    rooms,
    actChannel,
    user,
    friendList,
    bloquedList,
    closeChatBox,
    setNewRoom,
    FriendErrMsg,
    BlockErrMsg,
    resetErrMsg,
  } = useChat();

  function handleJoinRoom(key: string) {
    console.log("try to join:", key);
    if (key === actChannel) return;
    closeChatBox();
    const curRoom = rooms.find((room) => {
      return room.channel.id === key;
    });
    curRoom.newMessage = false;
    setNewRoom(curRoom);
    console.log("user set to: ", user);
  }

  const handleAddFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(newFriend);
    resetErrMsg();
    socket.emit("AddFriend", { newFriend });
  };

  const handleAddBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(newBlock);
    resetErrMsg();
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

  const handleSendDm = (username: string) => {
    const foundDmRoom = rooms.find((room) => {
      const u = room.user.find((usr) => {
        return usr.username === window.sessionStorage.getItem("username");
      });
      const u2 = room.user.find((usr) => {
        return usr.username === username;
      });
      return room.channel.type === ChannelType.dm && u && u2;
    });
    if (foundDmRoom) {
      closeChatBox();
      setNewRoom(foundDmRoom);
    } else {
      closeChatBox();
      socket.emit("Dm", { sendTo: username });
    }
  };

  function menuElemFriendlist() {
    return (
      <>
        <div className="profile__panel__top">Add friend</div>
        <div className="profile__panel__bottom">
          <form>
            <input
              value={newFriend}
              onChange={handleChangeNewFriend}
              placeholder="Nickname..."
              className="room-menu-input-search-friend-block"
            />
            <button onClick={handleAddFriend} className="fullwidth-button">
              <IoIosAddCircle />
            </button>
          </form>
          {FriendErrMsg && (
            <p className="room-chat-err-message">{FriendErrMsg}</p>
          )}
        </div>
        <div className="profile__panel__top">Friends</div>
        <div className="profile__panel__bottom">
          <ul>
            {friendList.map((friend, id) => {
              return (
                <li key={id}>
                  <button
                    className="room-menu-button-user-block-friend"
                    onClick={() => {
                      handleSendDm(friend.username);
                    }}
                  >
                    {friend.nickname}
                  </button>
                  <button
                    className="room-menu-button-remove-user"
                    onClick={() => {
                      handleRemoveFriend(friend.username);
                    }}
                  >
                    <MdPersonRemove />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }

  function menuElemBlocklist() {
    return (
      <>
        <div className="profile__panel__top">Add block</div>
        <div className="profile__panel__bottom">
          <form>
            <input
              value={newBlock}
              onChange={handleChangeNewBlock}
              placeholder="Nickname..."
              className="room-menu-input-search-friend-block"
            />
            <button onClick={handleAddBlock} className="fullwidth-button">
              <IoIosAddCircle />
            </button>
          </form>
          {BlockErrMsg && (
            <p className="room-chat-err-message">{BlockErrMsg}</p>
          )}
        </div>
        <div className="profile__panel__top">Blocked users</div>
        <div className="profile__panel__bottom">
          <ul>
            {bloquedList.map((block, id) => {
              return (
                <li key={id}>
                  <button className="room-menu-button-user-block-friend">
                    {block.nickname}
                  </button>
                  <button
                    className="room-menu-button-remove-user"
                    onClick={() => {
                      handleRemoveBlock(block.username);
                    }}
                  >
                    <MdPersonRemove />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }

  var chanListIsEmpty: boolean = true;

  function menuElemChannels() {
    return (
      <>
        <div className="profile__panel__top">Join channel</div>
        <div className="profile__panel__bottom">
          <ChannelJoinComponent />
        </div>
        <div className="profile__panel__top">
          Create channel
        </div>
        <div className="profile__panel__bottom">
          <ChannelCreationComponent />
        </div>
        <div className="profile__panel__top">Your channels</div>
        <div className="profile__panel__bottom chan-list">
          {(chanListIsEmpty = true)}
          {rooms &&
            rooms.map((room, id) => {
              if (room.channel.type === ChannelType.dm) return null;
              chanListIsEmpty = false;
              const channel = room.channel;
              return (
                <div key={id}>
                  <button
                    className="chan-list-button"
                    disabled={
                      channel.id === actChannel ||
                      (user && user.privilege === UserPrivilege.ban)
                    }
                    title={`Go to ${channel.name}`}
                    onClick={() => handleJoinRoom(channel.id)}
                  >
                    {channel.type === ChannelType.public && <FaGlobe />}
                    {channel.type === ChannelType.protected && <FaLock />}
                    {channel.type === ChannelType.private && <FaUserSecret />}
                    {channel.name}
                    {room.newMessage && <BiMessageAltAdd />}
                  </button>
                </div>
              );
            })}
          {chanListIsEmpty && <>Join a channel or create one to chat!</>}
        </div>
      </>
    );
  }

  var messageListIsEmpty: boolean = true;

  function menuElemMessages() {
    return (
      <>
        <div className="profile__panel__top">Contacts</div>
        <div className="profile__panel__bottom">
          {rooms.map((room, id) => {
            const usr = room.user.find((usr) => {
              return usr.username !== window.sessionStorage.getItem("username");
            });
            if (
              room.channel.type !== ChannelType.dm ||
              bloquedList.find((block) => {
                return block.username === usr.username;
              })
            )
              return null;
            messageListIsEmpty = false;
            return (
              <div key={id}>
                <button
                  title={`Join ${room.channel.name}`}
                  onClick={() => handleJoinRoom(room.channel.id)}
                  className="room-menu-button-dm"
                  disabled={room.channel.id === actChannel}
                >
                  {
                    room.user.find((usr) => {
                      return (
                        usr.username !==
                        window.sessionStorage.getItem("username")
                      );
                    }).username
                  }
                  {room.newMessage && <BiMessageAltAdd />}
                </button>
              </div>
            );
          })}
          {messageListIsEmpty && <>Your private chats will show here!</>}
        </div>
      </>
    );
  }

  if (actChannel) return <RoomComponent />;
  return (
    <>
      {selectedChatWindow === SelectedChatWindow.CHANNELS && menuElemChannels()}
      {selectedChatWindow === SelectedChatWindow.MESSAGES && menuElemMessages()}
      {selectedChatWindow === SelectedChatWindow.FRIENDLIST &&
        menuElemFriendlist()}
      {selectedChatWindow === SelectedChatWindow.BLOCKLIST &&
        menuElemBlocklist()}
    </>
  );
}

export default ChatMainComponent;
