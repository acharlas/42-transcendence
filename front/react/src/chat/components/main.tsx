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
import OnlineIndicatorComponent from "./online-indicator";

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
    inviteList,
    setInviteList,
    setSelectUser,
  } = useChat();

  function handleJoinRoom(key: string) {
    //console.log("try to join:", key);
    closeChatBox();
    const curRoom = rooms.find((room) => {
      return room.channel.id === key;
    });
    curRoom.newMessage = false;
    setNewRoom(curRoom);
    if (curRoom.channel.type === ChannelType.dm) {
      const other = curRoom.user.find((x) => {
        return x.id !== sessionStorage.getItem("userid");
      });
      setSelectUser(other);
    }
    //console.log("user set to: ", user);
  }

  const handleAddFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    //console.log(newFriend);
    resetErrMsg();
    socket.emit("AddFriend", { newFriend });
  };

  const handleAddBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    //console.log(newBlock);
    resetErrMsg();
    socket.emit("AddBlock", { newBlock });
  };

  const handleChangeNewFriend = (event) => {
    setNewFriend(event.target.value);
  };

  const handleChangeNewBlock = (event) => {
    setNewBlock(event.target.value);
  };

  const handleRemoveFriend = (nickname: string) => {
    socket.emit("RemoveFriend", { nickname });
  };

  const handleRemoveBlock = (nickname: string) => {
    socket.emit("RemoveBlock", { nickname });
  };

  const handleAcceptInvite = (userid: string) => {
    setInviteList(
      inviteList.filter((invite) => {
        if (invite.id === userid) return false;
        return true;
      })
    );
    socket.emit("AccepteGameInvite", { userid });
  };

  const handleSendDm = (nickname: string) => {
    const foundDmRoom = rooms.find((room) => {
      const u = room.user.find((usr) => {
        return usr.username === window.sessionStorage.getItem("username");
      });
      const u2 = room.user.find((usr) => {
        return usr.nickname === nickname;
      });
      return room.channel.type === ChannelType.dm && u && u2;
    });

    if (!foundDmRoom) {
      //console.log("send dm creation: ", nickname);
      closeChatBox();
      socket.emit("Dm", { sendTo: nickname });
      return;
    }
    closeChatBox();
    setNewRoom(foundDmRoom);
    if (foundDmRoom.channel.type === ChannelType.dm) {
      const other = foundDmRoom.user.find((x) => {
        return x.id !== sessionStorage.getItem("userid");
      });
      setSelectUser(other);
    }
  };

  function menuElemFriendlist() {
    return (
      <>
        <div className="profile__panel__top">Add friend</div>
        <div className="profile__panel__bottom">
          <form>
            <input value={newFriend} onChange={handleChangeNewFriend} placeholder="Nickname..." />
            <button onClick={handleAddFriend} className="fullwidth-button">
              <IoIosAddCircle />
            </button>
          </form>
          {FriendErrMsg && <p className="room-chat-err-message">{FriendErrMsg}</p>}
        </div>
        <div className="profile__panel__top">Friends</div>
        <div className="profile__panel__bottom">
          <ul>
            {friendList.map((friend, id) => {
              return (
                <li className="line-with-indicator" key={id}>
                  <OnlineIndicatorComponent id={friend.id} />
                  <button
                    className="room-menu-button-user-block-friend"
                    onClick={() => {
                      handleSendDm(friend.nickname);
                    }}
                  >
                    {friend.nickname}
                  </button>
                  <button
                    className="room-menu-button-remove-user"
                    onClick={() => {
                      //console.log("AUAUAU", friend);

                      handleRemoveFriend(friend.nickname);
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
            <input value={newBlock} onChange={handleChangeNewBlock} placeholder="Nickname..." />
            <button onClick={handleAddBlock} className="fullwidth-button">
              <IoIosAddCircle />
            </button>
          </form>
          {BlockErrMsg && <p className="room-chat-err-message">{BlockErrMsg}</p>}
        </div>
        <div className="profile__panel__top">Blocked users</div>
        <div className="profile__panel__bottom">
          <ul>
            {bloquedList.map((block, id) => {
              return (
                <li key={id}>
                  <button className="room-menu-button-user-block-friend">{block.nickname}</button>
                  <button
                    className="room-menu-button-remove-user"
                    onClick={() => {
                      handleRemoveBlock(block.nickname);
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
        <div className="profile__panel__top">Create channel</div>
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
                    disabled={channel.id === actChannel || (user && user.privilege === UserPrivilege.ban)}
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
                  onClick={() => handleJoinRoom(room.channel.id)}
                  className="room-menu-button-dm"
                  disabled={room.channel.id === actChannel}
                >
                  {
                    room.user.find((usr) => {
                      return usr.username !== window.sessionStorage.getItem("username");
                    }).nickname
                  }
                  {room.newMessage && <BiMessageAltAdd />}
                </button>
              </div>
            );
          })}
          {messageListIsEmpty && <>No private chats for now... chat with someone!</>}
        </div>
      </>
    );
  }

  var inviteListIsEmpty: boolean = true;
  function menuElemInvites() {
    return (
      <>
        <div className="profile__panel__top">Game invites</div>
        <div className="profile__panel__bottom">
          {inviteList.map((invite, id) => {
            //console.log("Game invite from:" + invite.nickname);
            inviteListIsEmpty = false;
            return (
              <div key={id}>
                <button onClick={() => handleAcceptInvite(invite.id)} className="room-menu-button-dm">
                  {"Play with " + invite.nickname}
                </button>
              </div>
            );
          })}
          {inviteListIsEmpty && <>No game invite at the moment.</>}
        </div>
      </>
    );
  }

  if (actChannel) return <RoomComponent />;
  return (
    <>
      {selectedChatWindow === SelectedChatWindow.CHANNELS && menuElemChannels()}
      {selectedChatWindow === SelectedChatWindow.MESSAGES && menuElemMessages()}
      {selectedChatWindow === SelectedChatWindow.INVITES && menuElemInvites()}
      {selectedChatWindow === SelectedChatWindow.FRIENDLIST && menuElemFriendlist()}
      {selectedChatWindow === SelectedChatWindow.BLOCKLIST && menuElemBlocklist()}
    </>
  );
}

export default ChatMainComponent;
