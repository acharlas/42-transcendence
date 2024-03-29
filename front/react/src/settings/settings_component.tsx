import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { ImCheckmark, ImCross } from "react-icons/im";

import { getUsersMe, patchNickname } from "../api/user-api";
import { requestMfaDisable, requestMfaSetupFinish, requestMfaSetupInit } from "../api/mfa-api";
import { deleteAvatar, postAvatar } from "../api/avatar-api";
import { MfaStatus } from "./constants/mfa-status";
import { AvatarStatus } from "./constants/avatar-status";
import DefaultAvatar from "../avatar/default_avatar_component";
import ReloadAvatar from "../avatar/reload_avatar_component";
import "../style.css";
import "../profile/profile.css";
import "./settings.css";

export default function Profile() {
  //utils
  function displayError(msg: string) {
    return <p className="error-msg">{msg}</p>;
  }

  // State variables
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<MfaStatus>(MfaStatus.LOADING);
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>(AvatarStatus.LOADING);
  const [avatarToUpload, setAvatarToUpload] = useState<File>(null);
  const [avatarReload, setAvatarReload] = useState<number>(0);
  const [smsCode, setSmsCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    const fetchSettingsData = async () => {
      await getUsersMe()
        .then((res) => {
          if (!res?.data) {
            throw new Error("no data");
          }
          setNickname(res.data?.nickname);
          setMfaStatus(res.data?.mfaEnabled ? MfaStatus.ENABLED : MfaStatus.DISABLED);
        })
        .catch((e) => {
          console.log("Settings: Error in fetchSettingsData", e);
        });
    };

    fetchSettingsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //AVATAR

  const uploadAvatar = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (avatarToUpload) {
      setAvatarError("");
      try {
        await postAvatar(avatarToUpload);
        setAvatarStatus(AvatarStatus.UPLOADED);
        setTimeout(() => {
          setAvatarReload(avatarReload + 1);
        }, 100);
      } catch (e) {
        setAvatarError(e?.response?.data?.message);
        console.log("failed to upload avatar");
      }
    } else {
      setAvatarError("please select a file to upload");
    }
  };

  const removeAvatar = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAvatarError("");
    try {
      await deleteAvatar();
      setAvatarStatus(AvatarStatus.DELETED);
    } catch (e) {
      setAvatarError(e?.response?.data?.message);
    }
  };

  function selectFile(event) {
    setAvatarToUpload(event.target.files[0]);
  }

  function avatarSettings() {
    return (
      <>
        <div className="profile__panel__top">Avatar</div>
        <div className="profile__panel__bottom profile__panel__avatar">
          <div className="settings__avatar__div">
            <div className="settings__avatar__container">
              {avatarStatus === AvatarStatus.DELETED
                ? DefaultAvatar("settings__avatar")
                : ReloadAvatar(window.sessionStorage.getItem("userid"), avatarReload, "settings__avatar")}
            </div>
            <input className="fullwidth-button margin-before" type="file" onChange={selectFile} />
            <button className="fullwidth-button margin-before" onClick={uploadAvatar}>
              Upload
            </button>
            <button className="fullwidth-button margin-before" onClick={removeAvatar}>
              Delete
            </button>
            {displayError(avatarError)}
          </div>
        </div>
      </>
    );
  }

  // NICKNAME

  const editNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setNicknameError("");
    try {
      await patchNickname({ nickname: newNickname });
      setEditingNickname(false);
      setNickname(newNickname);
      setNewNickname("");
    } catch (e) {
      setNicknameError(e?.response?.data?.message);
    }
  };

  const startEditingNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingNickname(true);
  };

  const stopEditingNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditingNickname(false);
    setNewNickname("");
  };

  const handleNewNicknameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(event.target.value);
  };
  const HandleSmsCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCode(event.target.value);
  };

  function nicknameSettings() {
    return (
      <>
        <div className="profile__panel__top">Nickname</div>
        <div className="profile__panel__bottom">
          {editingNickname ? (
            <div className="settings__line">
              <input
                className="settings__line__elem settings__nickname__input"
                placeholder="New nickname..."
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
          ) : (
            <div className="settings__line">
              <div className="settings__line__elem">{nickname}</div>
              <button className="settings__line__elem settings__button__texticon" onClick={startEditingNickname}>
                <FaPen className="settings__icon" />
              </button>
            </div>
          )}
          {displayError(nicknameError)}
        </div>
      </>
    );
  }

  // MFA

  const beginFlow = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    setMfaStatus(MfaStatus.INIT);
  };

  const sendCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    try {
      await requestMfaSetupInit({ phoneNumber: phoneNumber });
      setMfaStatus(MfaStatus.VALIDATE);
    } catch (e) {
      setMfaError(e?.response?.data?.message);
    }
  };

  const validateCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    try {
      const response = await requestMfaSetupFinish({ codeToCheck: smsCode });
      setSmsCode("");
      if (response?.status === 201) setMfaStatus(MfaStatus.ENABLED);
    } catch (e) {
      console.log("Settings: error in validateCode", e);
      setMfaError(e?.response?.data?.message);
    }
  };

  const disable = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    try {
      const response = await requestMfaDisable();
      if (response?.status === 204) {
        setMfaStatus(MfaStatus.DISABLED);
      } else {
        setMfaError("Disabling mfa failed.");
      }
    } catch (e) {
      setMfaError(e?.response?.data?.message);
    }
  };

  const cancelInit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    setPhoneNumber("");
    setMfaStatus(MfaStatus.DISABLED);
  };

  const cancelValidate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    setSmsCode("");
    setMfaStatus(MfaStatus.INIT);
  };

  const HandlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  function mfaSettings() {
    return (
      <>
        <div className="profile__panel__top">Two-factor authentication</div>
        <div className="profile__panel__bottom">
          {mfaStatus === MfaStatus.ENABLED && (
            <>
              <div className="settings__line">
                <div className="settings__line__elem">2FA is enabled</div>
                <button className="settings__button__texticon" onClick={disable}>
                  disable
                </button>
              </div>
            </>
          )}
          {mfaStatus === MfaStatus.DISABLED && (
            <>
              <div className="settings__line">
                <div className="settings__line__elem">2FA is disabled</div>
                <button className="settings__button__texticon" onClick={beginFlow}>
                  enable
                </button>
              </div>
            </>
          )}
          {mfaStatus === MfaStatus.INIT && (
            <>
              Enter a phone number (international format) to use for 2FA.
              <div className="settings__line">
                <input
                  className="settings__line__elem settings__nickname__input"
                  placeholder="+XX XXXXXXXXX"
                  value={phoneNumber}
                  onChange={HandlePhoneNumberChange}
                />
                <button className="settings__button__texticon" onClick={sendCode}>
                  <ImCheckmark className="settings__icon" />
                </button>
                <button className="settings__button__texticon" onClick={cancelInit}>
                  <ImCross className="settings__icon" />
                </button>
              </div>
            </>
          )}
          {mfaStatus === MfaStatus.VALIDATE && (
            <>
              Enter the code you should have received to {phoneNumber}.
              <div className="settings__line">
                <input
                  className="settings__line__elem settings__nickname__input"
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
                <button className="settings__button__texticon" onClick={validateCode}>
                  <ImCheckmark className="settings__icon" />
                </button>
                <button className="settings__button__texticon" onClick={cancelValidate}>
                  <ImCross className="settings__icon" />
                </button>
              </div>
            </>
          )}
          {displayError(mfaError)}
        </div>
      </>
    );
  }

  return (
    <>
      {avatarSettings()}
      {nicknameSettings()}
      {mfaSettings()}
    </>
  );
}
