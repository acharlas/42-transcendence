import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUserData } from "./getUserData"
import mfaService from "../mfa/mfa-service";
import defaultPicture from "../image/defaultPicture.png"
import "./settings.css"
// import "../style.css"


export default function Profile() {
  const navigate = useNavigate();

  const goSetupMfa = () => {
    navigate("/settings/mfa-init-setup");
  }

  const goSignIn = () => {
    navigate("/");
  }

  // State variables
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserData()
        .then((res) => {
          setUsername(res.username);
          setNickname(res.nickname);
          setMfaEnabled(res.mfaEnabled);
        })
        .catch((e) => {
          console.log("Settings: Error while fetching user data", { e });
          // redirect to auth page if auth failed
          if (e.response.status === 401) {
            goSignIn();
          }
        })
    };
    fetchUserData();
  });

  // MFA
  const enableMfa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    goSetupMfa();
  }

  const disableMfa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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

  function whenMfaEnabled() {
    return (
      <div>
        <div className="settings__mfa__status">
          2FA is enabled
        </div>
        <button onClick={disableMfa}>
          disable
        </button>
      </div>
    );
  }
  function whenMfaDisabled() {
    return (
      <div>
        <div className="settings__mfa__status">
          2FA is disabled
        </div>
        <button onClick={enableMfa}>
          enable
        </button>
      </div>
    );
  }


  return (
    <div className="container">
      <div className="settings_screen">
        <div className="screen__content">

          <div className="settings__title">
            Settings
          </div>

          <br></br>

          <div className="settings__block">
            <div className="settings__subtitle">
              Account information
            </div>

            <div className="settings__namewrap">
              <div className="settings__nameleft">
                username:
              </div>
              <div className="settings__nameright">
                {username}
              </div>
            </div>

            <div className="settings__namewrap">
              <div className="settings__nameleft">
                nickname:
              </div>
              <div className="settings__nameright">
                {nickname}
              </div>
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
              {mfaEnabled ? whenMfaEnabled() : whenMfaDisabled()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
