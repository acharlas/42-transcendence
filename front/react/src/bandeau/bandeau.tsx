import { useNavigate } from "react-router-dom";
import "./style-bandeau.css";
import { RiShutDownLine } from "react-icons/ri";

export interface IBandeauIndexProps {}

const BandeauIndex: React.FunctionComponent<IBandeauIndexProps> = (props) => {
  let navigate = useNavigate();

  const GoToProfil = () => {
    navigate("/profile/me");
  };

  const HandleDisconect = () => {
    navigate("/");
  };

  return (
    <div className="bandeau-container">
      <button onClick={GoToProfil} className="bandeau-button">
        profil
      </button>
      <button onClick={HandleDisconect} className="bandeau-button-disconect">
        <RiShutDownLine className="bandeau-disconnect-icon" />
      </button>
    </div>
  );
};

export default BandeauIndex;
