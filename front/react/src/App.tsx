import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import './style.css';
import { getMe } from './api/auth-api';
import SocketContextComponent from './chat/socket-component';
import ChatIndex from './chat/chat-index';
import HeaderLeft from './bandeau/header-left';
import HeaderRight from './bandeau/header-right';
import ChatProvider from './context/chat.context';
import HomeComponent from './home/home_index';
import Profile from './profile/profile_component';
import Settings from './settings/settings_component';
import Leaderboard from './leaderboard/leaderboard_component';
import GameIndex from './game/game-index';

export interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = (props) => {
  useEffect(() => {
    getMe();
  }, []);

  return (
    <ChatProvider>
    <SocketContextComponent>
    <div className="header-underline"></div>
    <div className="header-filter"></div>
    <div className="app-container">
      <div className="left-container">
        <div className="header-container left-side top-side">
          <HeaderLeft />
        </div>
        <div className="below-header-container left-side bot-side">
          <div>
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game" element={<GameIndex />} />
          </Routes>
          </div>
        </div>
      </div>
      <div className="right-container">
        <div className="header-container header-container-right right-side top-side">
          <HeaderRight />
        </div>
        <div className="below-header-container right-side bot-side">
          <div>
            <ChatIndex />
          </div>
        </div>
      </div>
    </div>
    </SocketContextComponent>
    </ChatProvider>
  );
};
export default App;
