import { useState } from "react";
import loginService from "./login-service";

export default function LoginForm() {
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newToken, setNewToken] = useState("");

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
      const token = await loginService.login({
        email: newEmail,
        password: newPass,
      });
      console.log("Debug 2");
      console.log(token);
      setNewToken(token);
      setNewEmail("");
      setNewPass("");
    } catch (e) {
      //setErrorMessage("Wrong credentials");
      setTimeout(() => {
        //setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <form onSubmit={addUser}>
      <div>
        <div>
          email: <input value={newEmail} onChange={HandleEmailChange} />
        </div>
        <div>
          password: <input value={newPass} onChange={HandlePassChange} />
        </div>
        <div>
          <button type="submit">Connect</button>
        </div>
      </div>
    </form>
  );
}
