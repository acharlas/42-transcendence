import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // FaUserLock,
  // FaUserPlus,
  // FaUserMinus,
  // FaMinus,
  // FaPlus,
  FaPen,
} from "react-icons/fa"
import {
  BsShieldFillMinus,
  BsShieldFillPlus,
  // BsShieldLockFill,
  // BsShieldSlashFill,
} from "react-icons/bs"
import {
  ImCheckmark,
  ImCross,
} from "react-icons/im"

import { getUsersMe, patchNickname } from "../api/user-api"
import { requestMfaDisable } from "../api/mfa-api";

import defaultPicture from "../image/defaultPicture.png"
import "../style.css"
import "../profile/profile.css"
import "./settings.css"

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
          setNickname(res.data.nickname);
          setMfaEnabled(res.data.mfaEnabled);
        })
        .catch((e) => {
          console.log("Settings: Error in fetchUserData", e);
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
    //TODO: check status
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
        setMfaEnabled(false);
      } else {
        //TODO
      }
    }
    catch (e) {
      console.log("Settings: error in disableMfa", e);
      //TODO
    }
  }

  function enableMfaButton() {
    return (
      <button className="settings__button__texticon" onClick={enableMfa}>
        enable
        <BsShieldFillPlus className="settings__icon" />
      </button>
    )
  }
  function disableMfaButton() {
    return (
      <button className="settings__button__texticon" onClick={disableMfa}>
        disable
        <BsShieldFillMinus className="settings__icon" />
      </button>
    )
  }


  function avatarSettings() {
    return (
      <div>

        <div className="profile__panel__top">
          <div className="profile__panel__title">
            Avatar
          </div>
        </div>
        <div className="profile__panel__bottom profile__panel__avatar">
          <div className="settings__avatar__div">
            <div className="settings__avatar__container">
              <img className="settings__avatar"
                src={defaultPicture}
                alt="" />
              {
                //TODO: display profile pictures
              }
            </div>
            <button className="settings__button__texticon">
              Upload a new avatar
              {/* <FaPlus className="settings__icon" /> */}
            </button>
            <button className="settings__button__texticon">
              Delete current avatar
              {/* <FaMinus className="settings__icon" /> */}
            </button>
          </div>
        </div>
      </div>
    )
  }

  function nicknameSettings() {
    return (
      <div>
        <div className="profile__panel__top">
          <div className="profile__panel__title">
            Nickname
          </div>
        </div>
        <div className="profile__panel__bottom">
          {editingNickname
            ?
            <div className="settings__line">
              <input className="settings__line__elem settings__nickname__input"
                placeholder="new nickname"
                value={newNickname}
                onChange={handleNewNicknameChange}
                type="text"
              />
              <div className="settings__line__elem settings__group__two__buttons">
                <button className="settings__button__texticon" onClick={editNickname}>
                  <ImCheckmark className="settings__icon" />
                </button>
                <button className="settings__button__texticon" onClick={stopEditingNickname}>
                  <ImCross className="settings__icon" />
                </button>
              </div>
            </div>
            :
            <div className="settings__line">
              <div className="settings__line__elem">
                {nickname}
              </div>
              <button className="settings__line__elem settings__button__texticon" onClick={startEditingNickname}>
                <FaPen className="settings__icon" />
              </button>
            </div>
          }
        </div>
      </div>
    )
  }

  function mfaSettings() {
    return (
      <div>
        <div className="profile__panel__top">
          <div className="profile__panel__title">
            Two-factor authentication
          </div>
        </div>
        <div className="profile__panel__bottom">
          <div className="settings__line">
            {mfaEnabled
              ?
              <div className="settings__line__elem">
                2FA is enabled
              </div>
              :
              <div className="settings__line__elem">
                2FA is disabled
              </div>
            }
            {mfaEnabled ? disableMfaButton() : enableMfaButton()}
          </div>
        </div>
      </div>
    );
  }

  function friendSettings() {
    return ("");
  }

  function blockSettings() {
    return ("");
  }

  return (
    <div className="profile__container">
      <div className="profile__screen">
        <div className="profile__content">
          {avatarSettings()}
          <br></br>
          {nicknameSettings()}
          <br></br>
          {mfaSettings()}
          <br></br>
          {friendSettings()}
          <br></br>
          {blockSettings()}
        </div>
      </div>
    </div>
  );
}
