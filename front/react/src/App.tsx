import { useEffect } from "react";

import "./style.css";
import ChatIndex from "./chat/chat-index";
import BandeauIndex from "./bandeau/bandeau";
import SocketContextComponent from "./chat/socket-component";
import ChatProvider from "./context/chat.context";
import { getMe } from "./api/auth-api";
import { Route, Routes } from "react-router-dom";
import HomeComponent from "./home/home_index";
import Profile from "./settings/settings_component";
import { MdLeaderboard } from "react-icons/md";
import Settings from "./settings/settings_component";

export interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = (props) => {
  useEffect(() => {
    getMe({ token: window.sessionStorage.getItem("Token") });
  }, []);

  return (
    <div className="container">
      <ChatProvider>
        <SocketContextComponent>
          <BandeauIndex />
          <ChatIndex />
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/:urlId" element={<Profile />} />
            <Route path="/leaderboard" element={<MdLeaderboard />} />
          </Routes>
        </SocketContextComponent>
      </ChatProvider>
    </div>
  );
};
export default App;
