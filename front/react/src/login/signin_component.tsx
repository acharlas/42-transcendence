import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { FaUserAstronaut, FaRocket, FaSpaceShuttle, FaLock, FaEye, FaEyeSlash, FaFighterJet } from "react-icons/fa";

import "./login_style.css";
import "../style.css";
import displayErrorMsgs from "../utils/displayErrMsgs";
import { signin } from "../api/auth-api";

interface DecodedToken {
  sub: string;
  fullyAuth: boolean;
  iat: string;
  exp: string;
}

export interface ISigninFormProps {}

const SigninForm: React.FunctionComponent<ISigninFormProps> = (props) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  let navigate = useNavigate();

  sessionStorage.clear();

  const HandleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };
  const HandlePassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(event.target.value);
  };

  const goSignup = () => {
    navigate("/signup");
  };
  const goHome = () => {
    navigate("/app");
  };
  const goSigninMfa = () => {
    navigate("/mfa-signin");
  };

  const ftShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setHidePassword(!hidePassword);
  };

  const signinClassic = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      const token = await signin({
        username: newUsername,
        password: newPass,
      });
      setNewUsername("");
      setNewPass("");
      const tokenInfo: DecodedToken = jwt_decode(token); //can throw InvalidTokenError
      if (tokenInfo.fullyAuth) {
        goHome();
      } else {
        goSigninMfa();
      }
    } catch (e) {
      setErrorMessage("Wrong username or password.");
    }
  };

  function generateState() {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let array = new Uint8Array(50);
    window.crypto.getRandomValues(array);
    array = array.map((x: number) => validChars.codePointAt(x % validChars.length));
    const randomState = String.fromCharCode.apply(null, array);
    return randomState;
  }

  function fortyTwoOauthUrl(): string {
    const url: string = `https://api.intra.42.fr/oauth/authorize
?client_id=${process.env.REACT_APP_42API_UID}
&redirect_uri=${encodeURI(process.env.REACT_APP_42API_REDIRECT)}
&response_type=code
&state=`;
    const state: string = generateState();
    sessionStorage.setItem("oauth_state", state);
    return url + state;
  }

  return (
    <div className="login__container">
      <div className="login__screen">
        <div className="login__screen__content">
          <form className="login">
            <div className="login__field">
              <FaUserAstronaut />
              <input
                className="login__input"
                placeholder="Username"
                value={newUsername}
                onChange={HandleUsernameChange}
              />
            </div>
            <div className="login__field">
              <FaLock />
              <input
                className="login__input"
                placeholder="Password"
                value={newPass}
                type={hidePassword ? "password" : "text"}
                onChange={HandlePassChange}
              />
              <button className="login__input___show-button" onClick={ftShowPassword}>
                {hidePassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {displayErrorMsgs(errorMessage)}
            <div>
              <button className="button login__buttons" onClick={signinClassic}>
                <span className="button__text">Log In Now</span>
                <FaRocket className="login__icon" />
              </button>
              <button className="button login__buttons" onClick={goSignup}>
                <span className="button__text">Signup Now</span>
                <FaSpaceShuttle className="login__icon" />
              </button>
              <a className="button login__buttons" href={fortyTwoOauthUrl()}>
                <span className="button__text">Oauth 42</span>
                <FaFighterJet className="login__icon" />
              </a>
            </div>
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
};

export default SigninForm;
