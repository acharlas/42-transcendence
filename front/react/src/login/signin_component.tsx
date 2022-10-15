import React from "react";
import { useState } from "react";
import loginService from "./login-service";
import "./login_style.css";
import "../style.css";
import {
  FaUserAstronaut,
  FaRocket,
  FaSpaceShuttle,
  FaLock,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  sub: string,
  fullyAuth: boolean,
  iat: string,
  exp: string,
}

export function SigninForm() {
  const [newUsername, setNewUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
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
    navigate("/home");
  };
  const goSigninMfa = () => {
    navigate("/mfa-signin");
  };

  const ftShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    var x = document.getElementById("inputPassword");
    if (!(x instanceof HTMLScriptElement))
      throw new Error("can't get password element");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  const signinClassic = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      const token = await loginService.signin({
        username: newUsername,
        password: newPass,
      });
      window.sessionStorage.setItem("Token", token);
      setNewUsername("");
      setNewPass("");
      const tokenInfo: DecodedToken = jwt_decode(token); //can throw InvalidTokenError
      if (tokenInfo.fullyAuth) {
        goHome();
      }
      else {
        goSigninMfa();
      }
    } catch (e) {
      setErrorMessage("wrong username or password");
    }
  };

  function signinFortytwo(/*event: React.MouseEvent<HTMLButtonElement>*/): string {
    let url = `https://api.intra.42.fr/oauth/authorize
?client_id=${process.env.REACT_APP_42API_UID}
&redirect_uri=${encodeURI(process.env.REACT_APP_42API_REDIRECT)}
&response_type=code
&state=`;
    let secretState = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const stringLength = Math.floor(Math.random() * 200);
    for (let i = 0; i < stringLength; i++) {
      secretState += possible.at(Math.floor(Math.random() * possible.length));
    }
    return url + secretState;
  }

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login">
            <div className="login__field">
              <FaUserAstronaut />
              <input
                className="login__input"
                placeholder="username"
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
                type="password"
                onChange={HandlePassChange}
                id="inputPassword"
              />
              <button
                className="login__input___show-button"
                onClick={ftShowPassword}
              >
                <FaEye />
              </button>
            </div>
            {ErrorMessage === null ? (
              ""
            ) : (
              <p className="error-msg">{ErrorMessage}</p>
            )}
            <div>
              <button className="button login__submit" onClick={signinClassic}>
                <span className="button__text">Log In Now</span>
                <FaRocket className="login__icon" />
              </button>
              <button className="button login__submit" onClick={goSignup}>
                <span className="button__text">Signup Now</span>
                <FaSpaceShuttle className="login__icon" />
              </button>
              <a className="button login__submit" href={signinFortytwo()}>
                <span className="button__text">Signin with</span>
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
}
