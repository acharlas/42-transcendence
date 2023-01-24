import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getUser } from "../api/user-api";
import Avatar from "../avatar/avatar_component";
import "../style.css";
import "./profile.css";
import { HistoryMatch } from "../game/game-type";
import { getHistory } from "../api/history-api";

interface User {
  nickname: string;
  wins: number;
  losses: number;
  mmr: number;
}

//preliminary checks before using the display component
export default function Profile() {
  // Navigation
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/app");
  };

  // State
  var { id } = useParams();

  const [userData, setUserData] = useState<User>({
    nickname: "",
    wins: 0,
    losses: 0,
    mmr: 0,
  });
  const [history, setHistory] = useState<HistoryMatch[]>([]);

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

    const fetchUserHistory = async () => {
      const comp = (a: HistoryMatch, b: HistoryMatch) => {
        if (a.date > b.date) return 1;
        else if (a.date === b.date) return 1;
        return 0;
      };
      await getHistory()
        .then((res) => {
          console.log("history: ", res);
          const hist = res.sort(comp);
          setHistory(hist);
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    };

    fetchUserData();
    fetchUserHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (<>
    <div className="profile__panel">
      <div className="profile__panel__top">
        <div className="profile__nickname">{userData.nickname}</div>
      </div>

      <div className="profile__panel__bottom">
        <div className="profile__avatar__container">
          {Avatar(id)}
        </div>
      </div>
    </div>

    <br></br>

    <div className="profile__stats__container">
      <div className="profile__panel">
        <div className="profile__panel__top">WINS</div>
        <div className="profile__panel__bottom">{userData.wins}</div>
      </div>

      <div className="profile__panel">
        <div className="profile__panel__top">LOSSES</div>
        <div className="profile__panel__bottom">{userData.losses}</div>
      </div>

      <div className="profile__panel">
        <div className="profile__panel__top">MMR</div>
        <div className="profile__panel__bottom">{userData.mmr}</div>
      </div>
    </div>

    <br></br>

    <div className="profile__panel">
      <div className="profile__panel__top">
        <div className="profile__panel__title">MATCH HISTORY</div>
      </div>
      <div className="profile__panel__bottom">
        <table className="profile__hist__table">
          <tbody>
            <tr className="profile__hist__head">
              <th>W/L</th>
              <th>SCORE</th>
              <th>MODE</th>
            </tr>
            {history.map((history, i) => {
              const me = history.player.find((player) => {
                if (player.id === id) return true;
                return false;
              });
              const add = history.player.find((player) => {
                if (player.id !== id) return true;
                return false;
              });
              if (me.placement === 1)
                return (
                  <tr key={i} className="profile__hist__w">
                    <th>W</th>
                    <th>
                      {me.score}-{add.score}
                    </th>
                    <th>{history.gameMode}</th>
                  </tr>
                );
              else
                return (
                  <tr key={i} className="profile__hist__l">
                    <th>L</th>
                    <th>
                      {me.score}-{add.score}
                    </th>
                    <th>{history.gameMode}</th>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>

    <br></br>

    <div className="profile__panel">
      <div className="profile__panel__top">
        <div className="profile__panel__title">ACHIEVEMENTS</div>
      </div>
      <div className="profile__panel__bottom profile__achiev__list">
        {/*TODO: achievements */}
        <div className="profile__achiev profile__bubble">on a roll</div>
        <div className="profile__achiev profile__bubble">close call</div>
        <div className="profile__achiev profile__bubble">reverse sweep</div>
      </div>
    </div>
  </>);
}
