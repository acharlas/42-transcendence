import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // FaUserLock,
  // FaUserPlus,
  // FaUserMinus,
  // FaMinus,
  // FaPlus,
  FaPen,
} from "react-icons/fa";
import {
  BsShieldFillMinus,
  BsShieldFillPlus,
  // BsShieldLockFill,
  // BsShieldSlashFill,
} from "react-icons/bs";
import { ImCheckmark, ImCross } from "react-icons/im";

import { getUsersMe, patchNickname } from "../api/user-api";
import {
  requestMfaDisable,
  requestMfaSetupFinish,
  requestMfaSetupInit,
} from "../api/mfa-api";
import { getBlock } from "../api/block-api";
import { getFriend } from "../api/friend-api";
import { deleteAvatar, postAvatar } from "../api/avatar-api";
import { MfaStatus } from "./constants/mfa-status";
import { AvatarStatus } from "./constants/avatar-status";
import DefaultAvatar from "../avatar/default_avatar_component";
import ReloadAvatar from "../avatar/reload_avatar_component";
import "../style.css";
import "../profile/profile.css";
import "./settings.css";
import BandeauIndex from "../bandeau/bandeau";
import ChatProvider from "../context/chat.context";
import SocketContextComponent from "../chat/socket-component";
import ChatIndex from "../chat/chat-index";

export default function Profile() {
  const navigate = useNavigate();
  const goSignIn = () => {
    navigate("/");
  };

  // State variables
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [blocklist, setBlocklist] = useState([]);
  const [friendlist, setFriendlist] = useState([]);
  const [mfaStatus, setMfaStatus] = useState<MfaStatus>(MfaStatus.LOADING);
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>(
    AvatarStatus.LOADING
  );
  const [avatarToUpload, setAvatarToUpload] = useState<File>(null);
  const [avatarReload, setAvatarReload] = useState<number>(0);
  const [smsCode, setSmsCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      await getUsersMe()
        .then((res) => {
          setNickname(res.data.nickname);
          setMfaStatus(
            res.data.mfaEnabled ? MfaStatus.ENABLED : MfaStatus.DISABLED
          );
        })
        .catch((e) => {
          console.log("Settings: Error in fetchUserData", e);
          // redirect to auth page if auth failed
          if (e.response.status === 401) {
            goSignIn();
          }
        });
    };

    const fetchBlocklist = async () => {
      await getBlock({ id: window.sessionStorage.getItem("userid") })
        .then((res) => {
          setBlocklist(res.data.myblock);
        })
        .catch((e) => {
          console.log("Error while fetching blocklist", e);
        });
    };

    const fetchFriendlist = async () => {
      await getFriend({ id: window.sessionStorage.getItem("userid") })
        .then((res) => {
          setFriendlist(res.data.myfriend);
        })
        .catch((e) => {
          console.log("Error while fetching friendlist", e);
        });
    };

    fetchUserData();
    fetchBlocklist();
    fetchFriendlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayError(msg: string) {
    return <p className="error-msg">{msg}</p>;
  }

  //AVATAR

  const uploadAvatar = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (avatarToUpload) {
      setAvatarError("");
      try {
        await postAvatar(avatarToUpload);
        setAvatarStatus(AvatarStatus.UPLOADED);
        setAvatarReload(avatarReload + 1);
      } catch (e) {
        setAvatarError("failed to upload avatar");
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
      setAvatarError("failed to delete avatar");
      console.log("failed to delete avatar");
    }
  };

  function selectFile(event) {
    setAvatarToUpload(event.target.files[0]);
  }

  function avatarSettings() {
    return (
      <>
        <div className="profile__panel__top">
          <div className="profile__panel__title">Avatar</div>
        </div>
        <div className="profile__panel__bottom profile__panel__avatar">
          <div className="settings__avatar__div">
            <div className="settings__avatar__container">
              {avatarStatus === AvatarStatus.DELETED
                ? DefaultAvatar("settings__avatar")
                : ReloadAvatar(
                    window.sessionStorage.getItem("userid"),
                    avatarReload,
                    "settings__avatar"
                  )}
            </div>
            <input type="file" onChange={selectFile} />
            <button
              className="settings__button__texticon"
              onClick={uploadAvatar}
            >
              Upload a new avatar
            </button>
            <button
              className="settings__button__texticon"
              onClick={removeAvatar}
            >
              Delete current avatar
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
    await patchNickname({ nickname: newNickname });
    //TODO: check status
    setNicknameError("TODO");
    setEditingNickname(false);
    setNickname(newNickname);
    setNewNickname("");
  };

  const startEditingNickname = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setEditingNickname(true);
  };

  const stopEditingNickname = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setEditingNickname(false);
    setNewNickname("");
  };

  const handleNewNicknameChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewNickname(event.target.value);
  };
  const HandleSmsCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmsCode(event.target.value);
  };

  function nicknameSettings() {
    return (
      <>
        <div className="profile__panel__top">
          <div className="profile__panel__title">Nickname</div>
        </div>
        <div className="profile__panel__bottom">
          {editingNickname ? (
            <div className="settings__line">
              <input
                className="settings__line__elem settings__nickname__input"
                placeholder="new nickname"
                value={newNickname}
                onChange={handleNewNicknameChange}
                type="text"
              />
              <div className="settings__line__elem settings__group__two__buttons">
                <button
                  className="settings__button__texticon"
                  onClick={editNickname}
                >
                  <ImCheckmark className="settings__icon" />
                </button>
                <button
                  className="settings__button__texticon"
                  onClick={stopEditingNickname}
                >
                  <ImCross className="settings__icon" />
                </button>
              </div>
            </div>
          ) : (
            <div className="settings__line">
              <div className="settings__line__elem">{nickname}</div>
              <button
                className="settings__line__elem settings__button__texticon"
                onClick={startEditingNickname}
              >
                <FaPen className="settings__icon" />
              </button>
            </div>
          )}
        </div>
        {displayError(nicknameError)}
      </>
    );
  }

  // MFA

  // click events

  const beginFlow = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMfaError("");
    setMfaStatus(MfaStatus.INIT);
  };

  const sendCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await requestMfaSetupInit({ phoneNumber: phoneNumber });
      setMfaError("");
      setMfaStatus(MfaStatus.VALIDATE);
    } catch (e) {
      console.log("Settings: error in sendCode", e);
      setMfaError("Bad number.");
      //TODO: improve error msg
    }
  };

  const validateCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await requestMfaSetupFinish({ codeToCheck: smsCode });
      setMfaError("");
      setSmsCode("");
      setMfaStatus(MfaStatus.ENABLED);
    } catch (e) {
      console.log("Settings: error in validateCode", e);
      setMfaError("Wrong code.");
      //TODO: improve error msg
    }
  };

  const disable = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await requestMfaDisable();
      if (response.status === 204) {
        setMfaError("");
        setMfaStatus(MfaStatus.DISABLED);
      } else {
        console.log("Settings: error in disableMfa", response);
        setMfaError("Disabling mfa failed.");
        //TODO: improve error msg
      }
    } catch (e) {
      console.log("Settings: error in disableMfa", e);
      setMfaError("Disabling mfa failed.");
      //TODO
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

  const HandlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(event.target.value);
  };

  function mfaSettings() {
    return (
      <>
        <div className="profile__panel__top">
          <div className="profile__panel__title">Two-factor authentication</div>
        </div>
        <div className="profile__panel__bottom">
          {mfaStatus === MfaStatus.ENABLED && (
            <>
              <div className="settings__line">
                <div className="settings__line__elem">2FA is enabled</div>
                <button
                  className="settings__button__texticon"
                  onClick={disable}
                >
                  disable
                  <BsShieldFillMinus className="settings__icon" />
                </button>
              </div>
            </>
          )}
          {mfaStatus === MfaStatus.DISABLED && (
            <>
              <div className="settings__line">
                <div className="settings__line__elem">2FA is disabled</div>
                <button
                  className="settings__button__texticon"
                  onClick={beginFlow}
                >
                  enable
                  <BsShieldFillPlus className="settings__icon" />
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
                <button
                  className="settings__button__texticon"
                  onClick={sendCode}
                >
                  <ImCheckmark className="settings__icon" />
                </button>
                <button
                  className="settings__button__texticon"
                  onClick={cancelInit}
                >
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
                <button
                  className="settings__button__texticon"
                  onClick={validateCode}
                >
                  <ImCheckmark className="settings__icon" />
                </button>
                <button
                  className="settings__button__texticon"
                  onClick={cancelValidate}
                >
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

  // FRIENDS

  function friendSettings() {
    return (
      <>
        <div className="profile__panel__top">
          <div className="profile__panel__title">Friends</div>
        </div>
        <div className="profile__panel__bottom">
          <table>
            <tbody>
              {friendlist.map((n, index) => (
                <tr key={n.nickname}>
                  <td>
                    <a href={"/profile/" + n.id}>{n.nickname}</a>
                  </td>
                  <td>unfriend</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function blockSettings() {
    return (
      <>
        <div className="profile__panel__top">
          <div className="profile__panel__title">Blocked users</div>
        </div>
        <div className="profile__panel__bottom">
          <table>
            <tbody>
              {blocklist.map((n, index) => (
                <tr key={n.nickname}>
                  <td>
                    <a href={"/profile/" + n.id}>{n.nickname}</a>
                  </td>
                  <td>unblock</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
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
    </>
  );
}
