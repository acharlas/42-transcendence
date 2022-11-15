import { useNavigate } from "react-router-dom";
import "./style-bandeau.css";
import { RiShutDownLine } from "react-icons/ri";

export interface IBandeauIndexProps { }

const BandeauIndex: React.FunctionComponent<IBandeauIndexProps> = (props) => {
  let navigate = useNavigate();

  const goProfile = () => {
    navigate("/app/profile/me");
  };

  const goLeaderboard = () => {
    navigate("/app/leaderboard");
  };

  const goSettings = () => {
    navigate("/app/settings");
  };

  const goHome = () => {
    navigate("/app");
  };

  const HandleDisconnect = () => {
    navigate("/");
  };

  return (
    <nav className="bandeau-container">
      <button onClick={goHome} className="bandeau-button">
        home
      </button>
      <button onClick={goProfile} className="bandeau-button">
        profile
      </button>
      <button onClick={goLeaderboard} className="bandeau-button">
        leaderboard
      </button>
      <button onClick={goSettings} className="bandeau-button">
        settings
      </button>
      <button onClick={HandleDisconnect} className="bandeau-button">
        <RiShutDownLine className="bandeau-disconnect-icon" />
      </button>
    </nav>
  );
};

export default BandeauIndex;
