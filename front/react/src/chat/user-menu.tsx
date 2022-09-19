import { FaWindowClose } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { User } from "./type";

function UserMenu({
  socket,
  showUser,
  setShowUser,
}: {
  socket: Socket;
  showUser: User;
  setShowUser: Function;
}) {
  const handleClose = () => {
    showUser ? setShowUser(false) : setShowUser(true);
  };

  return (
    <nav className="user-menu">
      <div>
        <button onClick={handleClose}>
          <FaWindowClose />
        </button>
        <p>{showUser.nickname}</p>
        <p>{showUser.username}</p>
      </div>
    </nav>
  );
}

export default UserMenu;
