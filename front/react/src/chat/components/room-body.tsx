import { Socket } from "socket.io-client";

import CreateRoomsContainer from "./channel-creation";
import JoinNewRoomComponent from "./channel-join";
import LockScreen from "./channel-join-password-input";

function ChatBodyComponent({
  socket,
  setNextRoom,
  nextRoom,
  JoinNewRoom,
}: {
  socket: Socket;
  setNextRoom: Function;
  nextRoom: string;
  JoinNewRoom: boolean;
}) {
  if (nextRoom) {
    return (
      <LockScreen
        socket={socket}
        nextRoom={nextRoom}
        setNextRoom={setNextRoom}
      />
    );
  } else if (JoinNewRoom) {
    return <JoinNewRoomComponent />;
  } else {
    return <CreateRoomsContainer />;
  }
}

export default ChatBodyComponent;
