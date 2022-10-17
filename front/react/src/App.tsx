import { useEffect } from "react";

import ChatIndex from "./chat/chat-index";
import SocketContextComponent from "./chat/socket-component";
import ChatProvider from "./context/chat.context";
import loginService from "./login/login-service";

export interface IAppProps { }
const App: React.FunctionComponent<IAppProps> = (props) => {
  useEffect(() => {
    loginService.getMe({ token: window.sessionStorage.getItem("Token") });
  }, [])

  return (
    <ChatProvider>
      <SocketContextComponent>
        <ChatIndex />
      </SocketContextComponent>
    </ChatProvider>
  );
};
export default App;
