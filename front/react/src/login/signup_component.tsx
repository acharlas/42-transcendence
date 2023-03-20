import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAstronaut, FaRocket, FaSpaceShuttle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import "./login_style.css";
import "../style.css";
import displayErrorMsgs from "../utils/displayErrMsgs";
import { signup } from "../api/auth-api";

export function SignupForm() {
  const [newPass, setNewPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
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
    navigate("/app");
  };

  const ftShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setHidePassword(!hidePassword);
  };

  const createUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      await signup({
        password: newPass,
        username: newUsername,
      });
      setNewPass("");
      setNewUsername("");
      goHome();
    } catch (e) {
      //console.log(e);
      setErrorMessage(e?.response?.data?.message);
    }
  };

  return (
    <div className="login__container">
      <div className="login__screen">
        <div className="login__screen__content">
          <form className="login__signup">
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
              <button className="button login__buttons" onClick={createUser}>
                <span className="button__text">Create account</span>
                <FaRocket className="login__icon" />
              </button>
              <button className="button login__buttons" onClick={goSignin}>
                <span className="button__text">Login instead?</span>
                <FaSpaceShuttle className="login__icon" />
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
