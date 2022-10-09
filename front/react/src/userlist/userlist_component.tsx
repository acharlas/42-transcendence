import React, { useEffect, useState } from "react";

import { getUsers } from "./user-api"

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
    <div>
      <h1>
        list of our users for debug / test purposes
      </h1>

      <table>
        <tbody>
          {userlist.map(n => (
            <tr key={n.id}>
              <td>{n.nickname}</td>
              <td>{n.id}</td>
              <td>
                <a href={"/profile/" + n.id}>profile
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table >
    </div >
  );
}
