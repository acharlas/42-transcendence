import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsersMe, patchNickname } from "../api/user-api"
import { requestMfaDisable } from "../api/mfa-api";

import defaultPicture from "../image/defaultPicture.png"
import "../style.css"
import "../profile/profile.css"

export default function Profile() {
  const navigate = useNavigate();

  const goSetupMfa = () => {
    navigate("/settings/mfa-init-setup");
  }

  const goSignIn = () => {
    navigate("/");
  }

  // State variables
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      await getUsersMe()
        .then((res) => {
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
  const editNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await patchNickname({ nickname: newNickname });
    setEditingNickname(false);
    setNewNickname("");
  }

  const startEditingNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingNickname(true);
  }

  const stopEditingNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingNickname(false);
    setNewNickname("");
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
      const response = await requestMfaDisable();
      if (response.status === 204) {
        console.log("disable successful");
        setMfaEnabled(false);
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
        <div>
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
        <div>
          2FA is disabled
        </div>
        <button onClick={enableMfa}>
          enable
        </button>
      </div>
    );
  }


  return (
    <div className="profile__container">
      <div className="profile__screen">
        <div className="profile__content">

          <div>
            <div className="profile__panel__top">
              <div className="profile__panel__title">
                Account information
              </div>
            </div>

            <div className="profile__panel__bottom">
              <div>
                nickname:
              </div>
              <div>
                <div>
                  {editingNickname
                    ?
                    <div>
                      <input
                        placeholder="new nickname"
                        value={newNickname}
                        onChange={handleNewNicknameChange}
                        type="text"
                      />
                      <div>
                        <button onClick={editNickname}>
                          edit
                        </button>
                        <button onClick={stopEditingNickname}>
                          cancel
                        </button>
                      </div>
                    </div>
                    :
                    <div>
                      <div>
                        {nickname}
                      </div>
                      <button
                        onClick={startEditingNickname}>
                        edit
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <br></br>

          <div>
            <div className="profile__panel__top">
              <div className="profile__panel__title">
                Profile picture
              </div>
            </div>
            <div className="profile__panel__bottom">
              <div className="profile__avatar__container">
                <img className="profile__avatar"
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
          </div>

          <br></br>

          <div>
            <div className="profile__panel__top">
              <div className="profile__panel__title">
                Two-factor authentication
              </div>
            </div>
            <div className="profile__panel__bottom">
              {mfaEnabled ? whenMfaEnabled() : whenMfaDisabled()}
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}
