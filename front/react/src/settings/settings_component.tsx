import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUserData } from "./getUserData"
import { patchUsername, patchNickname } from "./patchUserData"
import mfaService from "../mfa/mfa-service";
import defaultPicture from "../image/defaultPicture.png"
import "./settings.css"
import "../style.css"

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
  const [newUsername, setNewUsername] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
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

  // NAMES
  const editUsername = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    patchUsername({ username: newUsername });
    setEditingUsername(false);
    setNewUsername("");
  }
  const editNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    patchNickname({ nickname: newNickname });
    setEditingNickname(false);
    setNewNickname("");
  }

  const startEditingUsername = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingUsername(true);
  }
  const startEditingNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingNickname(true);
  }

  const stopEditingUsername = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingUsername(false);
    setNewUsername("");
  }
  const stopEditingNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingNickname(false);
    setNewNickname("");
  }

  const handleNewUsernameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  }
  const handleNewNicknameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(event.target.value);
  }

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

            <div className="settings__name__title">
              username:
            </div>
            <div className="settings__namewrap">
              <div>
                {editingUsername
                  ?
                  <div>
                    <input className="settings__name__edit"
                      placeholder="new username"
                      value={newUsername}
                      onChange={handleNewUsernameChange}
                      type="text"
                    />
                    <div>
                      <button className="settings__name__edit__button"
                        onClick={editUsername}>
                        edit
                      </button>
                      <button className="settings__name__edit__button"
                        onClick={stopEditingUsername}>
                        cancel
                      </button>
                    </div>
                  </div>
                  :
                  <div>
                    <div className="settings__name__noedit">
                      {username}
                    </div>
                    <div>
                      <button className="settings__name__edit__button"
                        onClick={startEditingUsername}>
                        edit
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>


            <div className="settings__name__title">
              nickname:
            </div>
            <div className="settings__namewrap">
              <div>
                {editingNickname
                  ?
                  <div>
                    <input className="settings__name__edit"
                      placeholder="new nickname"
                      value={newNickname}
                      onChange={handleNewNicknameChange}
                      type="text"
                    />
                    <div>
                      <button className="settings__name__edit__button"
                        onClick={editNickname}>
                        edit
                      </button>
                      <button className="settings__name__edit__button"
                        onClick={stopEditingNickname}>
                        cancel
                      </button>
                    </div>
                  </div>
                  :
                  <div>
                    <div className="settings__name__noedit">
                      {nickname}
                    </div>
                    <button className="settings__name__edit__button"
                      onClick={startEditingNickname}>
                      edit
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>

          <br></br>

          <div className="settings__block">
            <div className="settings__subtitle">
              Profile picture
            </div>
            <div className="settings__avatar__container">
              <img className="settings__avatar"
                src={defaultPicture}
                alt="" />
              {
                //TODO: display profile pictures
              }
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
