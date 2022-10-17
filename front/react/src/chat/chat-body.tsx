import { Socket } from "socket.io-client";
import CreateRoomsContainer from "./chat-create-room";
import JoinNewRoomComponent from "./chat-join-new-room";
import LockScreen from "./lock-screen";

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
    return (
      <JoinNewRoomComponent
        socket={socket}
        nextRoom={nextRoom}
        setNextRoom={setNextRoom}
      />
    );
  } else {
    return <CreateRoomsContainer />;
  }
}

export default ChatBodyComponent;
