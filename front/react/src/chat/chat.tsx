import SocketProvider from "../context/chat.context";
import ChatIndex from "./chat-index";

function Chat() {
  return (
    <SocketProvider>
      <ChatIndex />
    </SocketProvider>
  );
}

export default Chat;
