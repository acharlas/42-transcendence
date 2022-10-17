import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import ChatIndex from "./chat/chat-index";
import SocketContextComponent from "./chat/socket-component";
import ChatProvider from "./context/chat.context";

export interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <ChatProvider>
      <SocketContextComponent>
        <ChatIndex />
      </SocketContextComponent>
    </ChatProvider>
  );
};
export default App;
