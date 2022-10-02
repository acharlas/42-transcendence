import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'

import { User, getUser } from "./getUser";
import "../style.css";

export default function ProfilePage() {

  // Navigation
  const navigate = useNavigate();
  const goSignIn = () => {
    navigate("/");
  }

  // State variables
  const { id } = useParams();
  const [userData, setUserData] = useState<User>({ nickname: '' });

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
  }, [])
  return (
    <div className="container">
      <div className="settings_screen">
        <div className="screen__content">
          <div>
            {id}
          </div>
          <div>
            {userData.nickname}
          </div>
        </div>
      </div>
    </div>
  );
}
