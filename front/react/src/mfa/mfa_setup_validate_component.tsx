import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaRocket } from "react-icons/fa";

import { requestMfaSetupFinish } from "../api/mfa-api";

import "../style.css";
import "../login/login_style.css";
import "./mfa.css";

export default function MfaSetupValidate() {
  let navigate = useNavigate();
  const goSettings = () => {
    navigate("/settings");
  };

  const [smsCode, setSmsCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const HandleSmsCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCode(event.target.value);
  }

  const checkSmsCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      await requestMfaSetupFinish({ codeToCheck: smsCode });
      goSettings();
    } catch (e) {
      console.log({ e });
      setErrorMessage("Incorrect code."); //TODO: improve error msg
    }
  }
  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login">
            <div className="login__field">
              <FaLock className="sms__input__code__icon" />
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
            <div>
              {errorMessage === null ? (
                ""
              ) : (
                <p className="error-msg">{errorMessage}</p>
              )}
            </div>
            <button className="button__sms__check__submit" onClick={checkSmsCode}>
              <span className="button__text">Check code</span>
              <FaRocket className="sms__check__code__icon" />
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
