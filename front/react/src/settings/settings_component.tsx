import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import requestMfaDisable from "../mfa/mfa-service"

export default function Profile() {
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
          <div>
            update
            delete
          </div>
          <div>
            Two-factor authentication
          </div>
          <div>
            Enabled/diabled
          </div>
          <div>
            Enable
          </div>
          <div>
            disable
          </div>


        </div>
        <div className="screen__background">
        </div>
      </div>
    </div>
  );
}
