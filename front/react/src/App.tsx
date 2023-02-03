import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import "./style.css";
import { getMe } from "./api/auth-api";
import SocketContextComponent from "./chat/socket-component";
import AppHeaderComponent from "./headers/AppHeader";
import ChatHeaderComponent from "./headers/ChatHeader";
import ChatProvider from "./context/chat.context";
import HomeComponent from "./home/home_index";
import Profile from "./profile/profile_component";
import Settings from "./settings/settings_component";
import Leaderboard from "./leaderboard/leaderboard_component";
import GameIndex from "./game/game-index";
import RoomsMenuContainer from "./chat/components/main";

export interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = (props) => {
  const navigate = useNavigate();
  const goRoot = () => {
    navigate("/");
  };
  useEffect(() => {
    try {
      getMe();
    } catch (e) {
      goRoot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatProvider>
      <SocketContextComponent>
        <div className="header-line header-line-1a"></div>
        <div className="header-line header-line-1b"></div>
        <div className="header-line header-line-2a"></div>
        <div className="header-line header-line-2b"></div>
        <div className="header-filter header-filter-1"></div>
        <div className="header-filter header-filter-2"></div>
        <div className="header-container topbar">
          <AppHeaderComponent />
        </div>
        <div className="header-container bottombar">
          <ChatHeaderComponent />
        </div>
        <div className="app-container">
          <div className="middle">
            <div className="game-width">
              <div className="middle-container">
                <Routes>
                  <Route path="/" element={<HomeComponent />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/game/*" element={<GameIndex />} />
                </Routes>
              </div>
            </div>
            <div className="chat-width">
              <div className="middle-container">
                <RoomsMenuContainer />
              </div>
            </div>
          </div>
        </div>
      </SocketContextComponent>
    </ChatProvider>
  );
};
export default App;
