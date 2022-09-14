import { useNavigate } from "react-router-dom";
import { FaSms } from "react-icons/fa";
import "./2fa.css";
import "../login/login_style.css";
import "../style.css";

export default function Sms2faConfirm() {
  let navigate = useNavigate();
  const goChallenge = () => {
    navigate("/sms-challenge");
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <div className="login">
            <div className="login__field">
              <button
                className="button login__submit"
                onClick={goChallenge}
              >
                <span className="button__text">Send SMS</span>
                <FaSms className="login__icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div >
  );
}
