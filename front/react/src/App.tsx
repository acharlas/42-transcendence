import "./style.css";
import ChatIndex from "./chat/chat-index";
import BandeauIndex from "./bandeau/bandeau";
import SocketContextComponent from "./chat/socket-component";
import ChatProvider from "./context/chat.context";
import loginService from "./login/login-service";

export interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = (props) => {
  useEffect(() => {
    loginService.getMe({ token: window.sessionStorage.getItem("Token") });
  }, []);

  return (
    <div className="container">
      <ChatProvider>
        <SocketContextComponent>
          <BandeauIndex />
          <ChatIndex />
        </SocketContextComponent>
      </ChatProvider>
    </div>
  );
};
export default App;
