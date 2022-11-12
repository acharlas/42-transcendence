import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAstronaut,
  FaRocket,
  FaSpaceShuttle,
  FaLock,
} from "react-icons/fa";

import loginService from "./login-service";
import "./login_style.css";
import "../style.css";

export function SignupForm() {
  const [newPass, setNewPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  sessionStorage.clear();

  const HandlePassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(event.target.value);
  };

  const HandleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const goSignin = () => {
    navigate("/");
  };

  const goHome = () => {
    navigate("/home");
  };

  const createUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      console.log("click");
      setErrorMessage("");
      const token = await loginService.signup({
        password: newPass,
        username: newUsername,
      });
      console.log({ token });
      window.sessionStorage.setItem("Token", token);
      setNewPass("");
      setNewUsername("");
      goHome();
    } catch (e) {
      console.log({ e });
      return e;
    }
  };

  const ftShowPassword = () => {
    var x = document.getElementById("inputSignupPassword");
    if (!(x instanceof HTMLScriptElement))
      throw new Error("can't get password element");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  const ErrorMessageComp = () => {
    return (
      <div>
        <p className="error-msg">{ErrorMessage}</p>
      </div>
    );
  };

  return (
    <div className="login__container">
      <div className="login__screen">
        <div className="login__screen__content">
          <form className="login__signup">
            {ErrorMessage === null ? (
              ""
            ) : (
              <div>
                <ErrorMessageComp />
              </div>
            )}
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
                type="password"
                onChange={HandlePassChange}
                id="inputSignupPassword"
              />
            </div>
            <div>
              <input type="checkbox" onClick={ftShowPassword} />
              show password
            </div>

            <div>
              <button className="button login__submit" onClick={createUser}>
                <span className="button__text">Create account</span>
                <FaRocket className="signup__icon" />
              </button>
              <button className="button login__submit" onClick={goSignin}>
                <span className="button__text">Already a account?</span>
                <FaSpaceShuttle className="signin__icon" />
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
