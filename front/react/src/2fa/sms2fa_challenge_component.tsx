import { FaLock, FaRocket } from "react-icons/fa";
import "./2fa.css";
import "../login/login_style.css";
import "../style.css";

export default function Sms2faChallenge() {
  // let navigate = useNavigate();

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login">
            <div className="login__field">
              <FaLock className="sms__input__code__icon" />
              <input
                className="login__input"
                placeholder="XXXXXX"
              // value={smsCode}
              // onChange={HandleSmsCodeChange}
              />
            </div>
            <button className="button__sms__check__submit" /*onClick={checkSmsCode}*/>
              <span className="button__text">Check code</span>
              <FaRocket className="sms__check__code__icon" />
            </button>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
}
