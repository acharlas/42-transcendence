import { useState } from "react";
import loginService from "./login-service";
import "../style.css";

export default function SigninForm({ status }) {
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  const HandleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };
  const HandlePassChange = (event) => {
    setNewPass(event.target.value);
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
      status.Signin();
      setNewEmail("");
      setNewPass("");
    } catch (e) {
      console.log({ e });
      setErrorMessage("wrong username or password");
      /*setTimeout(() => {
        setErrorMessage(null);
      }, 5000);*/ //hide the wrong password message after a short moment
    }
  };

  const ftShowPassword = () => {
    var x = document.getElementById("inputPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  return (
    <div>
      <div>
        email: <input value={newEmail} onChange={HandleEmailChange} />
      </div>
      <div>
        password:{" "}
        <input
          value={newPass}
          type="password"
          onChange={HandlePassChange}
          id="inputPassword"
        />
      </div>
      {ErrorMessage === null ? "" : <p id="error-msg">{ErrorMessage}</p>}
      <div>
        <input type="checkbox" onClick={ftShowPassword} />
        show password
      </div>
      <div>
        <button onClick={status.SignupState}>Signup</button>
        <button onClick={addUser}>Connect</button>
      </div>
    </div>
  );
}
