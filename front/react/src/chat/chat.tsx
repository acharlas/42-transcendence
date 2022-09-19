import ChatProvider from "../context/chat.context";
import ChatIndex from "./chat-index";

function Chat() {
  return (
    <ChatProvider>
      <ChatIndex />
    </ChatProvider>
  );
}

export default Chat;
