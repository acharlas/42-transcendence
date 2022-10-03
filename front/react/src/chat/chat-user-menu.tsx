import { FaUserAstronaut, FaWindowClose } from "react-icons/fa";
import { MdAddModerator, MdRemoveModerator } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { HiMail, HiXCircle, HiBan } from "react-icons/hi";
import { TbMessageOff } from "react-icons/tb";
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

    console.log("newdate: ", newDate);

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "muted",
      time: newDate,
      toModifie: selectUser.username,
    });
  };

  const AdminUser = () => {
    console.log("admin user");

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "admin",
      time: null,
      toModifie: selectUser.username,
    });
  };

  const setToDefault = () => {
    console.log("remove admin");

    socket.emit("UpdateUserPrivilege", {
      roomId: actChannel,
      privilege: "default",
      time: null,
      toModifie: selectUser.username,
    });
  };
  console.log("userpivilege: ", user.privilege);
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
                <button onClick={MuteUser}>
                  <TbMessageOff />
                </button>
                <button onClick={banUser}>
                  <HiBan />
                </button>
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
