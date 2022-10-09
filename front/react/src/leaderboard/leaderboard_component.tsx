import React, { useEffect, useState } from "react";

import { getUsers } from "./user-api"
import "./leaderboard.css"
import "../style.css"

export default function Userlist() {

  const [userlist, setUserlist] = useState([]);

  useEffect(() => {
    const fetchUserlist = async () => {
      await getUsers()
        .then((res) => {
          setUserlist(res);
        })
        .catch((e) => {
          console.log("Error while fetching userlist", e);
        })
    };

    fetchUserlist();
  });

  return (
    <div className="profile__container">
      <div className="profile__screen">
        <div className="profile__content ">

          <div>leaderboard</div>

          <table>
            <tbody>
              <tr>
                <td>rank</td>
                <td>MMR</td>
                <td>player</td>
              </tr>
              {userlist.map((n, index) => (
                <tr key={n.mmr}>
                  <td>{index + 1}</td>
                  <td>{n.mmr}</td>
                  <td>
                    <a href={"/profile/" + n.id}>
                      {n.nickname}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
