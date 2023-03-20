import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getUser } from "../api/user-api";
import Avatar from "../avatar/avatar_component";
import "../style.css";
import "./profile.css";
import { Achievement, HistoryMatch } from "../game/game-type";
import { getHistory } from "../api/history-api";
import { getAchievement } from "../api/achiev-api";

interface User {
  nickname: string;
  wins: number;
  losses: number;
  mmr: number;
}

export default function Profile() {
  // Navigation
  const navigate = useNavigate();
  const goRoot = () => {
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
  const [achievement, setAchievement] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      await getUser({ id })
        .then((res) => {
          if (!res?.data) {
            throw new Error("No user data");
          }
          setUserData(res.data);
        })
        .catch((e) => {
          //console.log(e);
          goRoot();
          return;
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
          //console.log("history: ", res);
          const hist = res?.data?.sort(comp);
          setHistory(hist);
        })
        .catch((e) => {
          //console.log(e);
          goRoot();
          return;
        });
    };

    const fetchUserAchievement = async () => {
      await getAchievement()
        .then((res) => {
          //console.log("Achievement: ", res);
          setAchievement(res.data);
        })
        .catch((e) => {
          //console.log(e);
          goRoot();
          return;
        });
    };

    fetchUserData();
    fetchUserHistory();
    fetchUserAchievement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <div className="panel__row">
        <div className="avatar__width">
          <div className="profile__panel__top">{userData.nickname}</div>
          <div className="profile__panel__bottom rm__avatar__padding">
            <div className="profile__avatar__container">{Avatar(id)}</div>
          </div>
        </div>

        <div className="stats__width">
          <div className="profile__panel__top">MMR</div>
          <div className="profile__panel__bottom center__txt">{userData.mmr}</div>
          <div className="profile__panel__top">Wins</div>
          <div className="profile__panel__bottom center__txt">{userData.wins}</div>
          <div className="profile__panel__top">Losses</div>
          <div className="profile__panel__bottom center__txt">{userData.losses}</div>
        </div>
      </div>

      <div className="profile__panel">
        <div className="profile__panel__top">Match History</div>
        <div className="profile__panel__bottom rm__table__padding">
          <table className="profile__hist__table dotted__table">
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
                if (me?.placement === 1)
                  return (
                    <tr key={i} className="profile__hist__w">
                      <td>W</td>
                      <td>
                        {me?.score}-{add?.score}
                      </td>
                      <td>{history.gameMode}</td>
                    </tr>
                  );
                else
                  return (
                    <tr key={i} className="profile__hist__l">
                      <td>L</td>
                      <td>
                        {me?.score}-{add?.score}
                      </td>
                      <td>{history.gameMode}</td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="profile__panel">
        <div className="profile__panel__top">Achievements</div>
        <div className="profile__panel__bottom profile__achiev__list">
          {achievement &&
            achievement.map((ach, i) => {
              return (
                <div key={i} className="profile__achiev profile__bubble">
                  {ach}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
