import { FaUserAstronaut } from "react-icons/fa";
import { MdAddModerator, MdRemoveModerator } from "react-icons/md";
import { AiFillHeart, AiFillUnlock } from "react-icons/ai";
import { HiMail, HiXCircle } from "react-icons/hi";
import { GiPrisoner } from "react-icons/gi";
import { TbMessage, TbMessageOff } from "react-icons/tb";
import { ImUserMinus } from "react-icons/im";
import { useChat } from "../context/chat.context";
import { useContext } from "react";
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
    <>
      <button className="chat-box-button">
        <FaUserAstronaut className="chat-box-button-icon" />
      </button>
      <button className="chat-box-button">
        <HiMail className="chat-box-button-icon" />
      </button>
      <button className="chat-box-button">
        <AiFillHeart className="chat-box-button-icon" />
      </button>
      <button className="chat-box-button">
        <ImUserMinus className="chat-box-button-icon" />
      </button>
      {user.privilege !== "admin" && user.privilege !== "owner" ? (
        <></>
      ) : (
        <>
          {selectUser.privilege === "admin" && user.privilege === "owner" ? (
            <button onClick={setToDefault} className="chat-box-button">
              <MdRemoveModerator className="chat-box-button-icon" />
            </button>
          ) : (
            <></>
          )}
          {selectUser.privilege !== "owner" &&
          selectUser.privilege !== "admin" ? (
            <>
              <button onClick={AdminUser} className="chat-box-button">
                <MdAddModerator className="chat-box-button-icon" />
              </button>
              {selectUser.privilege === UserPrivilege.muted ? (
                <button onClick={setToDefault} className="chat-box-button">
                  <TbMessage className="chat-box-button-icon" />
                </button>
              ) : (
                <button onClick={MuteUser} className="chat-box-button">
                  <TbMessageOff className="chat-box-button-icon" />
                </button>
              )}
              {selectUser.privilege === UserPrivilege.ban ? (
                <button onClick={setToDefault} className="chat-box-button">
                  <AiFillUnlock className="chat-box-button-icon" />
                </button>
              ) : (
                <button onClick={banUser} className="chat-box-button">
                  <GiPrisoner className="chat-box-button-icon" />
                </button>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export default UserMenu;
