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
import { useNavigate, Link } from "react-router-dom";
import { Path } from "three";

/*<div className="api-signin">
                <h3>Signin with</h3>
                <input className="fortytwo-button" type="image" alt="" />
              </div>*/

export default function SigninForm() {
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  const HandleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };
  const HandlePassChange = (event) => {
    setNewPass(event.target.value);
  };

  const goSignup = () => {
    navigate("/signup");
  };

  const goGame = () => {
    navigate("/game");
  };

  const addUser = async (event) => {
    event.preventDefault();

    const user = {
      email: newEmail,
      password: newPass,
    };

    try {
      setErrorMessage(null);
      const token = await loginService.signin({
        email: newEmail,
        password: newPass,
      });
      window.localStorage.setItem("Token", token);
      setNewEmail("");
      setNewPass("");
      goGame();
    } catch (e) {
      console.log({ e });
      setErrorMessage("wrong username or password");
      /*setTimeout(() => {
        setErrorMessage(null);
      }, 5000);*/ //hide the wrong password message after a short moment
    }
  };

  const ftShowPassword = (event) => {
    event.preventDefault();

    var x = document.getElementById("inputPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  function signinFortytwo(event) {
    console.log("signinfortytwo");
    event.preventDefault();
    let ungessable = "";
    let url =
      "https://api.intra.42.fr/oauth/authorize?client_id=cc0a3271ddce31f6d121cb5a2a3489ca4200861da7da4a721eba8b5cf1c00ee2&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2F42-redirect&response_type=code&state=";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const stringLength = Math.floor(Math.random() * 200);

    for (let i = 0; i < stringLength; i++) {
      ungessable += possible.at(Math.floor(Math.random() * possible.length));
    }

    console.log({ ungessable });
    return (
      <Link
        className="button login__submit"
        to={(location = url + ungessable)}
        target="_blank"
      />
    );
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
                placeholder="Email"
                value={newEmail}
                onChange={HandleEmailChange}
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
                type="checkbox"
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
              <button className="button login__submit" onClick={addUser}>
                <span className="button__text">Log In Now</span>
                <FaRocket className="login__icon" />
              </button>
              <button className="button login__submit" onClick={goSignup}>
                <span className="button__text">Signup Now</span>
                <FaSpaceShuttle className="login__icon" />
              </button>
              <button className="button login__submit" onClick={signinFortytwo}>
                <span className="button__text">Signin with</span>
              </button>
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
