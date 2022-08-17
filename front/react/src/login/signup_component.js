import { useState } from "react";
import loginService from "./login-service";
import "../style.css";

export default function SignupForm({ status }) {
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [ErrorMessage, setErrorMessage] = useState([]);

  const HandleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };
  const HandlePassChange = (event) => {
    setNewPass(event.target.value);
  };

  const HandleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const createUser = async (event) => {
    event.preventDefault();

    const user = {
      email: newEmail,
      password: newPass,
    };

    try {
      setErrorMessage(null);
      const token = await loginService.signup({
        email: newEmail,
        password: newPass,
        username: newUsername,
      });
      window.sessionStorage.setItem("Token", token);
      status.signin();
      setNewEmail("");
      setNewPass("");
      setNewUsername("");
    } catch (e) {
      if (e.response.data.statusCode == 400)
        setErrorMessage(e.response.data.message);
      /*setTimeout(() => {
          setErrorMessage(null);
        }, 5000);*/ //hide the wrong password message after a short moment
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
          <p key={i} id="error-msg">
            {error}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      {ErrorMessage === null ? (
        ""
      ) : (
        <div>
          <ErrorMessageComp />
        </div>
      )}
      <div>
        email: <input value={newEmail} onChange={HandleEmailChange} />
      </div>
      <div>
        password:{" "}
        <input
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
        username: <input value={newUsername} onChange={HandleUsernameChange} />
      </div>
      <div>
        <button onClick={status.signinState}>Already a account?</button>
        <button onClick={createUser}>Create account</button>
      </div>
    </div>
  );
}
