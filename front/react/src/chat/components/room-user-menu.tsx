import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useChat } from "../../context/chat.context";
import SocketContext from "../../context/socket.context";
import { ChannelType, UserPrivilege } from "../type";
import ChannelTimeSelectorComponent from "./channel-time-selector";

function UserMenuComponent() {
  const {
    setSelectUser,
    selectUser,
    actChannel,
    user,
    showTimeSelector,
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
    console.log("set as admin");
    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "admin",
      time: null,
      toModifie: selectUser.username,
    });
    setSelectUser(undefined);
  };

  const setToDefault = () => {
    console.log("set to default");
    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "default",
      time: null,
      toModifie: selectUser.username,
    });
    setSelectUser(undefined);
  };

  const handleInviteToPlay = () => {
    socket.emit("InviteUserInGame", { inviteId: selectUser.id });
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
  return (
    <>
      <div className="profile__panel__top">{selectUser.username}</div>
      <div className="profile__panel__bottom">
        <button onClick={handleInviteToPlay} className="fullwidth-button">
          Invite to play
        </button>
        <button onClick={handleShowUserProfile} className="fullwidth-button">
          Go to profile
        </button>
        <button onClick={handleSendDm} className="fullwidth-button">
          Send message
        </button>

        {/* friend/unfriend */}
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

        {/* block/unblock */}
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

        {/* Owner can give/remove admin rights */}
        {user.privilege === "owner" &&
          (selectUser.privilege === "admin" ? (
            <button onClick={setToDefault} className="fullwidth-button">
              Revoke moderator rights
            </button>
          ) : (
            <button onClick={AdminUser} className="fullwidth-button">
              Make moderator
            </button>
          ))}

        {/* Admins can give/remove mutes and bans to non admins */}
        {(user.privilege === "admin" || user.privilege === "owner") &&
          selectUser.privilege !== "owner" &&
          selectUser.privilege !== "admin" && (
            <>
              {selectUser.privilege === UserPrivilege.ban ? (
                <button onClick={setToDefault} className="fullwidth-button">
                  Unban
                </button>
              ) : (
                <>
                  <button onClick={banUser} className="fullwidth-button">
                    Ban
                  </button>
                  {/* Only show mute option if user isn't banned */}
                  {selectUser.privilege === UserPrivilege.muted ? (
                    <button onClick={setToDefault} className="fullwidth-button">
                      Unmute
                    </button>
                  ) : (
                    <button onClick={MuteUser} className="fullwidth-button">
                      Mute
                    </button>
                  )}
                </>
              )}
            </>
          )}
        {showTimeSelector && <ChannelTimeSelectorComponent />}
      </div>
    </>
  );
}

export default UserMenuComponent;
