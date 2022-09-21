import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatProvider from "../context/chat.context";
import ChatIndex from "./chat-index";
import { Room } from "./type";

function Chat() {
  return (
    <ChatProvider>
      <ChatIndex />
    </ChatProvider>
  );
}

export default Chat;
