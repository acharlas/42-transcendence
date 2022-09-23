import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSms } from "react-icons/fa";
import "./mfa.css";
import "../login/login_style.css";
import "../style.css";
import mfaService from "./mfa-service";

export default function MfaSetupInit() {
  let navigate = useNavigate();

  const goValidate = () => {
    navigate("/mfa/setup/validate");
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const HandlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const sendMfaInitRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await mfaService.requestMfaSetupInit({ phoneNumber: phoneNumber });
      goValidate();
    }
    catch (e) {
      console.log({ e });
      setErrorMessage("Request failed."); //TODO: improve error msg
    }
  }

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <div className="login">
            <div className="login__field">
              <input
                className="login__input"
                placeholder="Phone number (international format)"
                value={phoneNumber}
                onChange={HandlePhoneNumberChange}
              />
              <button
                className="button login__submit"
                onClick={sendMfaInitRequest}
              >
                <span className="button__text">Send SMS</span>
                <FaSms className="login__icon" />
              </button>
            </div>
            {errorMessage === null ? (
              ""
            ) : (
              <p className="error-msg">{errorMessage}</p>
            )}
            <div>
            </div>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div >
  );
}
