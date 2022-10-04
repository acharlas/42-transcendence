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
  const newHour = useRef(null);
  const newMin = useRef(null);
  const { setSelectUser, selectUser, actChannel, user } = useChat();
  const { socket } = useContext(SocketContext).SocketState;

  const handleClose = () => {
    setSelectUser(undefined);
  };

  const banUser = () => {
    const date = new Date();
    const hour = newHour.current.value || "";
    const nbHour = +hour;
    const min = newMin.current.value || "";
    const nbMin = +min;

    const newDate = new Date(
      date.getTime() + 1000 * 60 * 60 * nbHour + 1000 * 60 * nbMin
    );

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "ban",
      time: newDate,
      toModifie: selectUser.username,
    });
    setSelectUser(undefined);
  };

  const MuteUser = () => {
    console.log("mute user");
    const date = new Date();
    const hour = newHour.current.value || "";
    const nbHour = +hour;
    const min = newMin.current.value || "";
    const nbMin = +min;

    const newDate = new Date(
      date.getTime() + 1000 * 60 * 60 * nbHour + 1000 * 60 * nbMin
    );

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "muted",
      time: newDate,
      toModifie: selectUser.username,
    });
    setSelectUser(undefined);
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
        <p>{selectUser.nickname}</p>
        <button onClick={handleClose}>
          <HiXCircle />
        </button>
        <button>
          <FaUserAstronaut />
        </button>
        <button>
          <HiMail />
        </button>
        <button>
          <AiFillHeart />
        </button>
        <button>
          <ImUserMinus />
        </button>
        {user.privilege !== "admin" && user.privilege !== "owner" ? (
          <>allo{user.privilege}</>
        ) : (
          <div>
            {selectUser.privilege === "admin" && user.privilege === "owner" ? (
              <button onClick={setToDefault}>
                <MdRemoveModerator />
              </button>
            ) : (
              <></>
            )}
            {selectUser.privilege !== "owner" &&
            selectUser.privilege !== "admin" ? (
              <div>
                <button onClick={AdminUser}>
                  <MdAddModerator />
                </button>
                {selectUser.privilege === UserPrivilege.muted ? (
                  <button onClick={setToDefault}>
                    <TbMessage />
                  </button>
                ) : (
                  <button onClick={MuteUser}>
                    <TbMessageOff />
                  </button>
                )}
                {selectUser.privilege === UserPrivilege.ban ? (
                  <button onClick={setToDefault}>
                    <AiFillUnlock />
                  </button>
                ) : (
                  <button onClick={banUser}>
                    <GiPrisoner />
                  </button>
                )}

                <input
                  type="number"
                  min="0"
                  max="9999"
                  ref={newHour}
                  placeholder="Hour"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  ref={newMin}
                  placeholder="Minutes"
                />
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
