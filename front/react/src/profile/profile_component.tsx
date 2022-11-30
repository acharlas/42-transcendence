import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { FaRocket } from "react-icons/fa";

import { getUser } from "../api/user-api";
import { addFriend, removeFriend, checkIfFriend } from "../api/friend-api";
import { addBlock, removeBlock, checkIfBlocked } from "../api/block-api";
import Avatar from "../avatar/avatar_component";
import "../style.css";
import "./profile.css";
import BandeauIndex from "../bandeau/bandeau";

interface User {
  nickname: string;
  wins: number;
  losses: number;
  mmr: number;
}

//preliminary checks before using the display component
export default function Profile() {
  // State
  var { id } = useParams();

  const [userData, setUserData] = useState<User>({
    nickname: "",
    wins: 0,
    losses: 0,
    mmr: 0,
  });
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  //useEffect once to get user data and friend/block initial status
  useEffect(() => {
    const fetchUserData = async () => {
      await getUser({ id })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((e) => {
          if (e.response.data.message === "no such user") {
            console.log("no such user");
            goHome();
            return;
          }
        });
    };

    const fetchFriendBlockStates = async () => {
      await checkIfFriend({ id: id })
        .then((res) => {
          setIsFriend(res);
        })
        .catch((e) => {
          console.log("checkIfFriend err: " + e);
        });

      await checkIfBlocked({ id: id })
        .then((res) => {
          setIsBlocked(res);
        })
        .catch((e) => {
          console.log("checkIfBlocked err: " + e);
        });
    };

    fetchUserData();
    fetchFriendBlockStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Navigation
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/app");
  };

  // Utils
  const isSelfProfile = () => {
    return id === sessionStorage.getItem("userid");
  };

  // Events
  const friendClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      if (isFriend) {
        await removeFriend({ id: id });
        setIsFriend(false);
      } else {
        await addFriend({ id: id });
        setIsFriend(true);
      }
    } catch (e) {
      console.log("Failed friend event.", e);
      //TODO: improve error
    }
  };

  const blockClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      if (isBlocked) {
        await removeBlock({ id: id });
        setIsBlocked(false);
      } else {
        await addBlock({ id: id });
        setIsBlocked(true);
      }
    } catch (e) {
      console.log("Failed block event.", e);
      //TODO: improve error
    }
  };

  return (
    <>
      <div className="container">
        <BandeauIndex />
        <div className="profile__screen">
          <div className="profile__content ">
            <div>
              <div className="profile__panel__top">
                <div className="profile__nickname">{userData.nickname}</div>
              </div>

              <div className="profile__panel__bottom">
                <div className="profile__avatar__container">
                  {Avatar(id)}
                  {/*TODO: display profile pictures */}

                  {isSelfProfile() || (
                    <div className="profile__button__container">
                      <button className="profile__button" onClick={friendClick}>
                        {isFriend ? "UNFRIEND" : "FRIEND"}
                      </button>
                      <button className="profile__button" onClick={blockClick}>
                        {isBlocked ? "UNBLOCK" : "BLOCK"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <br></br>

            <div className="profile__stats__container">
              <div className="profile__stats__unit">
                <div className="profile__panel__top">WINS</div>
                <div className="profile__panel__bottom">{userData.wins}</div>
              </div>

              <div className="profile__stats__unit">
                <div className="profile__panel__top">LOSSES</div>
                <div className="profile__panel__bottom">{userData.losses}</div>
              </div>

              <div className="profile__stats__unit">
                <div className="profile__panel__top">MMR</div>
                <div className="profile__panel__bottom">{userData.mmr}</div>
              </div>
            </div>

            <br></br>

            <div className="profile__panel__top">
              <div className="profile__panel__title">MATCH HISTORY</div>
            </div>
            <table className="profile__panel__bottom profile__hist__table">
              {/*TODO: match history*/}
              <tbody>
                <tr className="profile__hist__head">
                  <th>W/L</th>
                  <th>SCORE</th>
                  <th>MODE</th>
                </tr>
                <tr className="profile__hist__w">
                  <th>W</th>
                  <th>10-8</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__l">
                  <th>L</th>
                  <th>3-10</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__l">
                  <th>L</th>
                  <th>6-10</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__w">
                  <th>W</th>
                  <th>10-9</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__l">
                  <th>L</th>
                  <th>3-10</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__w">
                  <th>W</th>
                  <th>10-9</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__w">
                  <th>W</th>
                  <th>10-8</th>
                  <th>classic</th>
                </tr>
                <tr className="profile__hist__l">
                  <th>L</th>
                  <th>6-10</th>
                  <th>classic</th>
                </tr>
              </tbody>
            </table>

            <br></br>

            <div className="profile__panel__top">
              <div className="profile__panel__title">ACHIEVEMENTS</div>
            </div>
            <div className="profile__panel__bottom profile__achiev__list">
              {/*TODO: achievements */}
              <div className="profile__achiev profile__bubble">on a roll</div>
              <div className="profile__achiev profile__bubble">close call</div>
              <div className="profile__achiev profile__bubble">
                reverse sweep
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
