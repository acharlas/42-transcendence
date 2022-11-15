import React, { useEffect, useState } from "react";

import { getUsers } from "../api/user-api"
import "./leaderboard.css"
import "../style.css"
import ChatProvider from "../context/chat.context";
import SocketContextComponent from "../chat/socket-component";
import ChatIndex from "../chat/chat-index";
import BandeauIndex from "../bandeau/bandeau";

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
        })
    };

    fetchUserlist();
  }, []);

  return (
    <ChatProvider>
      <SocketContextComponent>
        <ChatIndex />
        <div className="container">
          <BandeauIndex />
          <div className="profile__screen">
            <div className="profile__content ">

              <div className="profile__panel__top">
                1v1 matches
              </div>

              <div className="profile__panel__bottom">
                <table>
                  <tbody>
                    <tr>
                      <td>rank</td>
                      <td>MMR</td>
                      <td>player</td>
                    </tr>
                    {userlist.map((n, index) => (
                      <tr key={n.id}>
                        {/*can't sort by mmr because keys must be unique*/}
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

              <div className="profile__panel__top">
                battle royale
              </div>

              <div className="profile__panel__bottom">
                todo
              </div>

            </div>
          </div>
        </div>
      </SocketContextComponent>
    </ChatProvider>
  );
}
