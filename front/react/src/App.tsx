import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import './style.css';
import { getMe } from './api/auth-api';
import SocketContextComponent from './chat/socket-component';
import ChatIndex from './chat/chat-index';
import BandeauIndex from './bandeau/bandeau';
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
    <div className="container">
      <ChatProvider>
        <SocketContextComponent>
          <BandeauIndex />
          <ChatIndex />
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game" element={<GameIndex />} />
          </Routes>
        </SocketContextComponent>
      </ChatProvider>
    </div>
  );
};
export default App;
