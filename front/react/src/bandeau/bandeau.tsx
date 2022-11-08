import { useNavigate } from "react-router-dom";
import "./style-bandeau.css";
import { RiShutDownLine } from "react-icons/ri";

export interface IBandeauIndexProps {}

const BandeauIndex: React.FunctionComponent<IBandeauIndexProps> = (props) => {
  let navigate = useNavigate();

  const goProfile = () => {
    navigate("/profile/me");
  };

  const goSettings = () => {
    navigate("/settings");
  };

  const goHome = () => {
    navigate("/home");
  };

  const HandleDisconect = () => {
    navigate("/");
  };

  return (
    <div className="bandeau-container">
      <button onClick={goHome} className="bandeau-button">
        home
      </button>
      <button onClick={goProfile} className="bandeau-button">
        profile
      </button>
      <button onClick={goSettings} className="bandeau-button">
        settings
      </button>
      <button onClick={HandleDisconect} className="bandeau-button-disconect">
        <RiShutDownLine className="bandeau-disconnect-icon" />
      </button>
    </div>
  );
};

export default BandeauIndex;
