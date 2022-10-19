import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // FaUserLock,
  // FaUserPlus,
  // FaUserMinus,
  // FaMinus,
  // FaPlus,
  FaPen,
  FaSms,
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
import { getBlock } from "../api/block-api";
import { getFriend } from "../api/friend-api";
import { MfaStatus } from "./constants/mfa-status";
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

  const goValidate = () => {
    navigate("/settings/mfa-finish-setup");
  };

  // State variables
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [blocklist, setBlocklist] = useState([]);
  const [friendlist, setFriendlist] = useState([]);
  const [mfaStatus, setMfaStatus] = React.useState<MfaStatus>(MfaStatus.Disabled);
  // Error msgs
  const [errMsgMfaDisable, setErrMsgMfaDisable] = useState("");
  const [errMsgMfaInit, setErrMsgMfaInit] = useState("");
  const [errMsgMfaValidate, setErrMsgMfaValidate] = useState("");
  const [errMsgMfaEnabled, setErrMsgMfaEnabled] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      await getUsersMe()
        .then((res) => {
          setNickname(res.data.nickname);
          setMfaStatus(res.data.mfaEnabled ? MfaStatus.Enabled : MfaStatus.Disabled);
        })
        .catch((e) => {
          console.log("Settings: Error in fetchUserData", e);
          // redirect to auth page if auth failed
          if (e.response.status === 401) {
            goSignIn();
          }
        })
    };

    const fetchBlocklist = async () => {
      await getBlock({ id: window.sessionStorage.getItem("userid") })
        .then((res) => {
          setBlocklist(res.data.myblock);
        })
        .catch((e) => {
          console.log("Error while fetching blocklist", e);
        })
    };

    const fetchFriendlist = async () => {
      await getFriend({ id: window.sessionStorage.getItem("userid") })
        .then((res) => {
          console.log(res.data)

          setFriendlist(res.data.myfriend);
        })
        .catch((e) => {
          console.log("Error while fetching friendlist", e);
        })
    };

    fetchUserData();
    fetchBlocklist();
    fetchFriendlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function displayError(msg: string) {
    return (
      <p className="error-msg">{msg}</p>
    );
  }


  //AVATAR

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



  // NICKNAME

  const editNickname = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await patchNickname({ nickname: newNickname });
    //TODO: check status
    setEditingNickname(false);
    setNickname(newNickname);
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
        setMfaStatus(MfaStatus.Disabled);
      } else {
        console.log("Settings: error in disableMfa", response);
        setErrMsgMfaDisable("Disabling mfa failed.")
        //TODO
      }
    }
    catch (e) {
      console.log("Settings: error in disableMfa", e);
      setErrMsgMfaDisable("Disabling mfa failed.")
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

  function mfaSettingsInit() {
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
        {displayError(errMsgMfaInit)}
      </div >);
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
            {mfaStatus === MfaStatus.Enabled
              ?
              <div className="settings__line__elem">
                2FA is enabled
              </div>
              :
              <div className="settings__line__elem">
                2FA is disabled
              </div>
            }
            {mfaStatus === MfaStatus.Enabled ? disableMfaButton() : enableMfaButton()}
          </div>
        </div>
      </div>
    );
  }



  // FRIENDS

  function friendSettings() {
    return (
      <div>
        <div className="profile__panel__top">
          <div className="profile__panel__title">
            Friends
          </div>
        </div>
        <div className="profile__panel__bottom">
          <table>
            <tbody>
              {friendlist.map((n, index) => (
                <tr key={n.nickname}>
                  <td>
                    <a href={"/profile/" + n.id}>
                      {n.nickname}
                    </a>
                  </td>
                  <td>
                    unfriend
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function blockSettings() {
    return (
      <div>
        <div className="profile__panel__top">
          <div className="profile__panel__title">
            Blocked users
          </div>
        </div>
        <div className="profile__panel__bottom">
          <table>
            <tbody>
              {blocklist.map((n, index) => (
                <tr key={n.nickname}>
                  <td>
                    <a href={"/profile/" + n.id}>
                      {n.nickname}
                    </a>
                  </td>
                  <td>
                    unblock
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
