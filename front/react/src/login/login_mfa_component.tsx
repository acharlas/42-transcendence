import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

import "./login_style.css";
import "../style.css";
import displayErrorMsgs from "../utils/displayErrMsgs";
import { checkMfaDto, requestMfaSigninFinish, requestMfaSigninInit } from "../api/mfa-api";

export default function MfaSignin() {
  let navigate = useNavigate();
  const goHome = () => {
    navigate("/home");
  };

  const [smsCode, setSmsCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const HandleSmsCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCode(event.target.value);
  };

  const signinWithMfa = async (params: checkMfaDto) => {
    try {
      const response = await requestMfaSigninFinish(params);
      window.sessionStorage.setItem(`Token`, response.data.access_token);
      return response;
    } catch (e) {
      console.log(`Mfa error`, { e });
      return e;
    }
  };

  const sendSmsCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    //TODO: countdown/modularity
    await requestMfaSigninInit();
  };

  const checkSmsCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      await signinWithMfa({ codeToCheck: smsCode });
      goHome();
    } catch (e) {
      console.log({ e });
      setErrorMessage("Incorrect code."); //TODO: improve error msg
    }
  };
  return (
    <div className="login__container">
      <div className="login__screen">
        <div className="login__screen__content">
          <form className="login">
            <button className="login__buttons" onClick={sendSmsCode}>
              <span className="button__text">Send me a code</span>
              <FaRocket className="login__icon" />
            </button>
            <div className="authcode__field">
              <input
                className="login__input"
                placeholder="XXXXXX"
                value={smsCode}
                //accept max. 6 digits
                maxLength={6}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={HandleSmsCodeChange}
              />
            </div>
            {displayErrorMsgs(errorMessage)}
            <button
              className="login__buttons"
              onClick={checkSmsCode}
            >
              <span className="button__text">Check code</span>
              <FaRocket className="login__icon" />
            </button>
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
