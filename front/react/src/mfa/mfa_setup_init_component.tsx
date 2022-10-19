import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSms } from "react-icons/fa";

import { requestMfaSetupInit } from "../api/mfa-api";

import "../style.css";
import "../login/login_style.css";
import "./mfa.css";

export default function MfaSetupInit() {
  let navigate = useNavigate();

  const goValidate = () => {
    navigate("/settings/mfa-finish-setup");
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const HandlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const sendMfaInitRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await requestMfaSetupInit({ phoneNumber: phoneNumber });
      goValidate();
    }
    catch (e) {
      console.log({ e });
      setErrorMessage("Request failed."); //TODO: improve error msg
    }
  }

  return (
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
  );
}
