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
    navigate('/app/profile/' + id);
  }

  return (
    <>
      <div className="container">
        <div className="profile__screen">
          <div className="profile__content ">
            <div className="profile__panel__top">1v1 matches</div>

            <div className="profile__panel__bottom">
              <table>
                <tbody>
                  <tr>
                    <th>rank</th>
                    <th>MMR</th>
                    <th>player</th>
                  </tr>
                  {userlist.map((n, index) => (
                    <tr
                      className="lb__clickable__line"
                      key={n.id}
                      onClick={event => handleProfileClick(event, n.id)}
                    >
                      <td>{index + 1}</td>
                      <td>{n.mmr}</td>
                      <td>{n.nickname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="profile__panel__top">battle royale</div>

            <div className="profile__panel__bottom">todo</div>
          </div>
        </div>
      </div>
    </>
  );
}
