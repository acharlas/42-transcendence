import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { FaRocket } from "react-icons/fa";

import { User, getUser } from "./getUser";
import defaultPicture from "../image/defaultPicture.png"
import "../style.css";
import "./profile.css";

export default function ProfilePage() {

  // Navigation
  const navigate = useNavigate();
  const goSignIn = () => {
    navigate("/");
  }

  // State variables
  const { id } = useParams();
  const [userData, setUserData] = useState<User>({ nickname: '', wins: 0, losses: 0, mmr: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      await getUser({ id })
        .then((res) => {
          console.log("res:", res);
          setUserData(res);
          console.log("userData:", userData);
        })
        .catch((e) => {
          // redirect to auth page if auth failed
          if (e.response.status === 401) {
            console.log("Not identified: redirecting", e);
            goSignIn();
          }
          else {
            console.log(e);
            //todo: no such user
          }
        })
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // FRIEND
  const addFriend = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }
  const removeFriend = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  // BLOCK
  const addBlock = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }
  const removeBlock = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  return (
    <div className="profile__container">
      <div className="profile__screen">
        <div className="profile__content ">

          <div>

            <div className="profile__panel__top">
              <div className="profile__nickname">
                {userData.nickname}
              </div>
            </div>

            <div className="profile__panel__bottom">
              <div className="profile__avatar__container">
                <img className="profile__avatar"
                  src={defaultPicture}
                  alt="" />
                {/*TODO: display profile pictures */}
                <div className="profile__button__container">

                  <button className="profile__button"
                    onClick={addFriend}>
                    +FRIEND
                  </button>
                  {/* <button className="profile__button"
                  onClick={removeFriend}>
                  -FRIEND
                </button> */}
                  <button className="profile__button"
                    onClick={addBlock}>
                    +BLOCK
                  </button>
                  {/* <button className="profile__button"
                  onClick={removeBlock}>
                  -BLOCK
                </button> */}
                </div>
              </div>

            </div>

          </div>

          <br></br>

          <div className="profile__stats__container">
            <div className="profile__stats__unit">
              <div className="profile__panel__top">
                WINS
              </div>
              <div className="profile__panel__bottom">
                {userData.wins}
              </div>
            </div>

            <div className="profile__stats__unit">
              <div className="profile__panel__top">
                LOSSES
              </div>
              <div className="profile__panel__bottom">
                {userData.losses}
              </div>
            </div>

            <div className="profile__stats__unit">
              <div className="profile__panel__top">
                MMR
              </div>
              <div className="profile__panel__bottom">
                {userData.mmr}
              </div>
            </div>
          </div>

          <br></br>

          <div className="profile__panel__top">
            <div className="profile__panel__title">
              MATCH HISTORY
            </div>
          </div>
          <table className="profile__panel__bottom profile__hist__table">
            {/*TODO: match history*/}
            {/* <table> */}
            <tr className="profile__hist__head"><th>W/L</th><th>SCORE</th><th>MODE</th></tr>
            <tr className="profile__hist__w"><th>W</th><th>10-8</th><th>classic</th></tr>
            <tr className="profile__hist__l"><th>L</th><th>3-10</th><th>classic</th></tr>
            <tr className="profile__hist__l"><th>L</th><th>6-10</th><th>classic</th></tr>
            <tr className="profile__hist__w"><th>W</th><th>10-9</th><th>classic</th></tr>
            <tr className="profile__hist__l"><th>L</th><th>3-10</th><th>classic</th></tr>
            <tr className="profile__hist__w"><th>W</th><th>10-9</th><th>classic</th></tr>
            <tr className="profile__hist__w"><th>W</th><th>10-8</th><th>classic</th></tr>
            <tr className="profile__hist__l"><th>L</th><th>6-10</th><th>classic</th></tr>
          </table>
          {/* </div> */}

          <br></br>

          <div className="profile__panel__top">
            <div className="profile__panel__title">
              ACHIEVEMENTS
            </div>
          </div>
          <div className="profile__panel__bottom profile__achiev__list">
            {/*TODO: achievements */}
            <div className="profile__achiev profile__bubble">
              on a roll
            </div>
            <div className="profile__achiev profile__bubble">
              close call
            </div>
            <div className="profile__achiev profile__bubble">
              reverse sweep
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}
