import { useNavigate } from 'react-router-dom';

import './style-bandeau.css';

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

  const goGame = () => {
    navigate('/app/game');
  };

  return (
    <>
      <button onClick={goHome} className="bandeau-button no-margin-left">
        home
      </button>
      <button onClick={goGame} className="bandeau-button">
        play
      </button>
      <button onClick={goLeaderboard} className="bandeau-button">
        rankings
      </button>
      <button onClick={goProfile} className="bandeau-button">
        profile
      </button>
      <button onClick={goSettings} className="bandeau-button">
        settings
      </button>
    </>
  );
};

export default BandeauIndex;
