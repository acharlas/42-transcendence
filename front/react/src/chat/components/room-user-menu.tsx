import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import { ChannelType, User, UserPrivilege } from "../type";

function UserMenu() {
  const {
    setSelectUser,
    selectUser,
    actChannel,
    user,
    setShowTimeSelector,
    friendList,
    bloquedList,
    rooms,
    closeChatBox,
    setNewRoom,
  } = useChat();
  const { socket } = useContext(SocketContext).SocketState;

  let navigate = useNavigate();

  const banUser = () => {
    setShowTimeSelector(UserPrivilege.ban);
  };

  const MuteUser = () => {
    setShowTimeSelector(UserPrivilege.muted);
  };

  const handleAddFriend = () => {
    socket.emit("AddFriend", { newFriend: selectUser.username });
  };

  const handleBlockUser = () => {
    socket.emit("AddBlock", { newBlock: selectUser.username });
  };

  const handleRemoveBlock = () => {
    socket.emit("RemoveBlock", { username: selectUser.username });
  };

  const handleRemoveFriend = () => {
    socket.emit("RemoveFriend", { username: selectUser.username });
  };

  const AdminUser = () => {
    console.log("admin user");

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "admin",
      time: null,
      toModifie: selectUser.username,
    });
    // setSelectUser(undefined);
  };

  const setToDefault = () => {
    console.log("set to default");

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "default",
      time: null,
      toModifie: selectUser.username,
    });
    // setSelectUser(undefined);
  };

  const handleShowUserProfile = () => {
    navigate("/app/profile/" + selectUser.id);
  };

  const handleSendDm = () => {
    const chan = rooms.find((room) => {
      const u = room.user.find((usr) => {
        if (usr.username === window.sessionStorage.getItem("username"))
          return true;
        return false;
      });
      const u2 = room.user.find((usr) => {
        if (usr.username === selectUser.username) return true;
        return false;
      });
      if (room.channel.type === ChannelType.dm && u && u2) return true;
      return false;
    });
    if (!chan) {
      console.log("send dm creation: ", selectUser.username);
      socket.emit("Dm", { sendTo: selectUser.username });
      return;
    }
    console.log("chan found: ", chan);
    closeChatBox();
    setNewRoom(chan);
  };

  if (user.username === selectUser.username) return <></>;
  return (<>
    <div className="profile__panel__top">
      {selectUser.username}
    </div>
    <div className="profile__panel__bottom">
      <button onClick={handleShowUserProfile} className="fullwidth-button">
        Go to profile
      </button>
      <button onClick={handleSendDm} className="fullwidth-button">
        Send message
      </button>
      {!friendList.find((user) => {
        if (selectUser.username === user.username) return true;
        return false;
      }) ? (
        <button onClick={handleAddFriend} className="fullwidth-button">
          Friend
        </button>
      ) : (
        <button onClick={handleRemoveFriend} className="fullwidth-button">
          Unfriend
        </button>
      )}
      {!bloquedList.find((user) => {
        if (selectUser.username === user.username) return true;
        return false;
      }) ? (
        <button onClick={handleBlockUser} className="fullwidth-button">
          Block
        </button>
      ) : (
        <button onClick={handleRemoveBlock} className="fullwidth-button">
          Unblock
        </button>
      )}
      {user.privilege !== "admin" && user.privilege !== "owner" ? (
        <></>
      ) : (
        <>
          {selectUser.privilege === "admin" && user.privilege === "owner" ? (
            <button onClick={setToDefault} className="fullwidth-button">
              Revoke moderator rights
            </button>
          ) : (
            <></>
          )}
          {selectUser.privilege !== "owner" &&
            selectUser.privilege !== "admin" ? (
            <>
              <button onClick={AdminUser} className="fullwidth-button">
                Make moderator
              </button>
              {selectUser.privilege === UserPrivilege.muted ? (
                <button onClick={setToDefault} className="fullwidth-button">
                  Unmute
                </button>
              ) : (
                <button onClick={MuteUser} className="fullwidth-button">
                  Mute
                </button>
              )}
              {selectUser.privilege === UserPrivilege.ban ? (
                <button onClick={setToDefault} className="fullwidth-button">
                  Unban
                </button>
              ) : (
                <button onClick={banUser} className="fullwidth-button">
                  Ban
                </button>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  </>);
}

export default UserMenu;
