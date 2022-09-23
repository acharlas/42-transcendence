import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import mfaService from "../mfa/mfa-service";
import defaultPicture from "../image/defaultPicture.png"
import "./settings.css"
import "../style.css"

export default function Profile() {
  const navigate = useNavigate();

  const goSetupMfa = () => {
    navigate("/settings/mfa-init-setup");
  }

  const enableMfa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    goSetupMfa();
  }

  const disableMfa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(defaultPicture);

    try {
      const response = await mfaService.requestMfaDisable();
      if (response.status === 204) {
        console.log("disable successful");
      } else {
        console.log("disable failed");
      }
    }
    catch (e) {
      console.log({ e });
      //TODO
    }
  }
  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">

          <div className="settings__subtitle">
            Settings
          </div>

          <br></br>

          <div className="settings__block">
            <div className="settings__subtitle">
              Account information
            </div>
            <div>
              username
            </div>
            <div>
              nickname
            </div>
          </div>

          <br></br>

          <div className="settings__block">
            <div className="settings__subtitle">
              Profile picture
            </div>
            <div className="settings__profile__picture__container">
              <img className="settings__profile__picture" src={defaultPicture} alt="default pic" />
            </div>
            <button>
              update
            </button>
            <button>
              delete
            </button>
          </div>

          <br></br>

          <div className="settings__block">
            <div className="settings__subtitle">
              Two-factor authentication
            </div>
            <div>
              Enabled/diabled
            </div>
            <button onClick={enableMfa}>
              enable
            </button>
            <button onClick={disableMfa}>
              disable
            </button>
          </div>


        </div>
        <div className="screen__background">
        </div>
      </div>
    </div>
  );
}
