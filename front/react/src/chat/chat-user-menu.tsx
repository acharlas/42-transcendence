import { FaUserAstronaut } from "react-icons/fa";
import { MdAddModerator, MdRemoveModerator } from "react-icons/md";
import { AiFillHeart, AiFillUnlock } from "react-icons/ai";
import { HiMail, HiXCircle } from "react-icons/hi";
import { GiPrisoner } from "react-icons/gi";
import { TbMessage, TbMessageOff } from "react-icons/tb";
import { ImUserMinus } from "react-icons/im";
import { useChat } from "../context/chat.context";
import { useContext, useRef } from "react";
import SocketContext from "../context/socket.context";
import { UserPrivilege } from "./type";

function UserMenu() {
  const { setSelectUser, selectUser, actChannel, user, setShowTimeSelector } =
    useChat();
  const { socket } = useContext(SocketContext).SocketState;

  const handleClose = () => {
    setSelectUser(undefined);
  };

  const banUser = () => {
    setShowTimeSelector(UserPrivilege.ban);
  };

  const MuteUser = () => {
    setShowTimeSelector(UserPrivilege.muted);
  };

  const AdminUser = () => {
    console.log("admin user");

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

  if (user.username === selectUser.username) return <></>;
  return (
    <nav className="user-menu">
      <div>
        <p className="user-menu-username">{selectUser.nickname}</p>
        <button onClick={handleClose} className="user-menu-button">
          <HiXCircle className="user-menu-button-icon" />
        </button>
        <button className="user-menu-button">
          <FaUserAstronaut className="user-menu-button-icon" />
        </button>
        <button className="user-menu-button">
          <HiMail className="user-menu-button-icon" />
        </button>
        <button className="user-menu-button">
          <AiFillHeart className="user-menu-button-icon" />
        </button>
        <button className="user-menu-button">
          <ImUserMinus className="user-menu-button-icon" />
        </button>
        {user.privilege !== "admin" && user.privilege !== "owner" ? (
          <>{user.privilege}</>
        ) : (
          <div>
            {selectUser.privilege === "admin" && user.privilege === "owner" ? (
              <button onClick={setToDefault} className="user-menu-button">
                <MdRemoveModerator className="user-menu-button-icon" />
              </button>
            ) : (
              <></>
            )}
            {selectUser.privilege !== "owner" &&
            selectUser.privilege !== "admin" ? (
              <div>
                <button onClick={AdminUser} className="user-menu-button">
                  <MdAddModerator className="user-menu-button-icon" />
                </button>
                {selectUser.privilege === UserPrivilege.muted ? (
                  <button onClick={setToDefault} className="user-menu-button">
                    <TbMessage className="user-menu-button-icon" />
                  </button>
                ) : (
                  <button onClick={MuteUser} className="user-menu-button">
                    <TbMessageOff className="user-menu-button-icon" />
                  </button>
                )}
                {selectUser.privilege === UserPrivilege.ban ? (
                  <button onClick={setToDefault} className="user-menu-button">
                    <AiFillUnlock className="user-menu-button-icon" />
                  </button>
                ) : (
                  <button onClick={banUser} className="user-menu-button">
                    <GiPrisoner className="user-menu-button-icon" />
                  </button>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserMenu;
