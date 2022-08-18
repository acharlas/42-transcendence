import "../style.css";
import "./login_style.css";
import SigninForm from "./signin_component";
import { useState } from "react";
import SignupForm from "./signup_component";

function useSigninStatus(status) {
  const [isSignin, setSignin] = useState(status);
  const [isSignupState, setSignupState] = useState(status);

  function SignupState() {
    setSignupState(true);
  }

  function SigninState() {
    setSignupState(false);
  }

  function Signin() {
    setSignin(true);
  }

  function Signout() {
    window.sessionStorage.removeItem("Token");
    setSignin(false);
  }

  return {
    isSignupState,
    SignupState,
    SigninState,
    isSignin,
    Signin,
    Signout,
  };
}

function LoginPage({ Status }) {
  return (
    <div>
      {Status.isSignupState === true ? (
        <div>
          <SignupForm status={Status} />
        </div>
      ) : (
        <div>
          <SigninForm status={Status} />
        </div>
      )}
    </div>
  );
}

export default { useSigninStatus, LoginPage };
