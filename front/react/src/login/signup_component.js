import { useState } from "react";
import loginService from "./login-service";
import "./login_style.css";
import "../style.css";
import {
  FaUserAstronaut,
  FaRocket,
  FaSpaceShuttle,
  FaLock,
  FaSatelliteDish,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [ErrorMessage, setErrorMessage] = useState([]);
  let navigate = useNavigate();

  const HandleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };
  const HandlePassChange = (event) => {
    setNewPass(event.target.value);
  };

  const HandleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const goSignin = () => {
    navigate("/");
  };

  const goGame = () => {
    navigate("/game");
  };

  const createUser = async (event) => {
    event.preventDefault();
    const user = {
      email: newEmail,
      password: newPass,
    };

    try {
      console.log("click");
      setErrorMessage(null);
      const token = await loginService.signup({
        email: newEmail,
        password: newPass,
        username: newUsername,
      });
      console.log({ token });
      window.localStorage.setItem("Token", token);
      setNewEmail("");
      setNewPass("");
      setNewUsername("");
      goGame();
    } catch (e) {
      console.log({ e });
      return e;
    }
  };

  const ftShowPassword = () => {
    var x = document.getElementById("inputSignupPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  const ErrorMessageComp = () => {
    return (
      <div>
        {ErrorMessage.map((error, i) => (
          <p key={i} className="error-msg">
            {error}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login-signup">
            {ErrorMessage === null ? (
              ""
            ) : (
              <div>
                <ErrorMessageComp />
              </div>
            )}
            <div className="login__field">
              <FaSatelliteDish />
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
                id="inputSignupPassword"
              />
            </div>
            <div>
              <input type="checkbox" onClick={ftShowPassword} />
              show password
            </div>
            <div className="login__field">
              <FaUserAstronaut />
              <input
                className="login__input"
                placeholder="Username"
                value={newUsername}
                onChange={HandleUsernameChange}
              />
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
