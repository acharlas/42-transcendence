import { useNavigate } from 'react-router-dom';
import { RiShutDownLine } from 'react-icons/ri';

import './style-bandeau.css';
import { deleteRefreshToken } from '../api/refresh-api';

export interface IBandeauIndexProps {}

const BandeauIndex: React.FunctionComponent<IBandeauIndexProps> = (props) => {
  let navigate = useNavigate();

  const goProfile = () => {
    navigate('/app/profile/' + window.sessionStorage.getItem('userid'));
  };

  const goLeaderboard = () => {
    navigate('/app/leaderboard');
  };

  const goSettings = () => {
    navigate('/app/settings');
  };

  const goHome = () => {
    navigate('/app');
  };

  const HandleDisconnect = async () => {
    try {
      await deleteRefreshToken();
    } catch {}
    navigate('/');
  };

  return (
    <>
      <button onClick={goHome} className="bandeau-button extra-margin-left">
        messages
      </button>
      <button onClick={goProfile} className="bandeau-button">
        channels
      </button>
      <button onClick={goLeaderboard} className="bandeau-button">
        friendlist
      </button>
      <button onClick={goSettings} className="bandeau-button">
        blocklist
      </button>
      <button onClick={HandleDisconnect} className="bandeau-button margin-left no-margin-right bandeau-disconnect-button">
        <RiShutDownLine className="bandeau-disconnect-icon" />
      </button>
    </>
  );
};

export default BandeauIndex;
