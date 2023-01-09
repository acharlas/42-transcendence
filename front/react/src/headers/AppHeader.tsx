import { RiShutDownLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { deleteRefreshToken } from '../api/refresh-api';

import './headers.css';

const AppHeaderComponent: React.FunctionComponent = () => {

  const pathToHome = '/app';
  const pathToGame = '/app/game';
  const pathToLeaderboard = '/app/leaderboard';
  const pathToProfile = () => {return '/app/profile/' + window.sessionStorage.getItem('userid');};
  const pathToSettings = '/app/settings';

  let navigate = useNavigate();
  const goHome = () => { navigate(pathToHome); };
  const goGame = () => { navigate(pathToGame); };
  const goLeaderboard = () => { navigate(pathToLeaderboard); };
  const goProfile = () => { navigate(pathToProfile()); };
  const goSettings = () => { navigate(pathToSettings); };

  const HandleDisconnect = async () => {
    try {
      await deleteRefreshToken();
    } catch { }
    navigate('/');
  };

  return (
    <>
      <button onClick={goHome}
        className="headers-button"
        disabled={window.location.pathname === pathToHome}
      >
        home
      </button>
      <button onClick={goGame}
        className="headers-button"
        disabled={window.location.pathname === pathToGame}
      >
        play
      </button>
      <button onClick={goLeaderboard}
        className="headers-button"
        disabled={window.location.pathname === pathToLeaderboard}
      >
        rankings
      </button>
      <button onClick={goProfile}
        className="headers-button"
        disabled={window.location.pathname === pathToProfile()}
      >
        profile
      </button>
      <button onClick={goSettings}
        className="headers-button"
        disabled={window.location.pathname === pathToSettings}
      >
        settings
      </button>
      <button onClick={HandleDisconnect}
        className="headers-button headers-disconnect-button">
        <RiShutDownLine className="headers-disconnect-icon" />
      </button>
    </>
  );
};

export default AppHeaderComponent;
