import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsers } from "../api/user-api";
import "./leaderboard.css";
import "../style.css";

export default function Userlist() {
  const [userlist, setUserlist] = useState([]);

  useEffect(() => {
    const fetchUserlist = async () => {
      await getUsers()
        .then((res) => {
          if (!res?.data) {
            throw new Error("no data");
          }
          setUserlist(res.data);
        })
        .catch((e) => {
          console.log("Error while fetching userlist", e);
        });
    };

    fetchUserlist();
  }, []);

  const navigate = useNavigate();

  const handleProfileClick = async (event: React.MouseEvent<HTMLTableRowElement>, id: string) => {
    event.preventDefault();
    navigate("/app/profile/" + id);
  };

  return (
    <>
      <div className="profile__screen">
        <div className="profile__content ">
          <div className="profile__panel__top">Astropong leaderboard</div>

          <div className="profile__panel__bottom rm__table__padding">
            <table className="profile__hist__table lb__row__color">
              <tbody>
                <tr className="profile__hist__head">
                  <th>Rank</th>
                  <th>MMR</th>
                  <th>Player</th>
                </tr>
                {userlist
                  .sort(function (a, b) {
                    return b.mmr - a.mmr;
                  })
                  .map((n, index) => (
                    <tr className="lb__clickable__line" key={n.id} onClick={(event) => handleProfileClick(event, n.id)}>
                      <td>{index + 1}</td>
                      <td>{n.mmr}</td>
                      <td>{n.nickname}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
