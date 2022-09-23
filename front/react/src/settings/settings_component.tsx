import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import mfaService from "../mfa/mfa-service";

export default function Profile() {
  const navigate = useNavigate();

  const goSetupMfa = () => {
    navigate("/settings/mfa-init-setup");
  }

  const enableMfa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    goSetupMfa();
  }

  const disableMfa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await mfaService.requestMfaDisable();
      if (response.status === 204) {
        console.log("disable successful");
      } else {
        console.log("disable failed");
      }
    }
    catch (e) {
      console.log({ e });
      //TODO
    }
  }
  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <div>
            Settings
          </div>
          <div>
            Account information
          </div>
          <div>
            username
          </div>
          <div>
            nickname
          </div>
          <div>
            profile picture
          </div>
          <button>
            update
          </button>
          <button>
            delete
          </button>
          <div>
            Two-factor authentication
          </div>
          <div>
            Enabled/diabled
          </div>
          <button onClick={enableMfa}>
            enable
          </button>
          <button onClick={disableMfa}>
            disable
          </button>


        </div>
        <div className="screen__background">
        </div>
      </div>
    </div>
  );
}
