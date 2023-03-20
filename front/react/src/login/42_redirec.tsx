import { useNavigate, useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";

import { fortyTwoSign } from "../api/auth-api";

interface DecodedToken {
  sub: string;
  fullyAuth: boolean;
  iat: string;
  exp: string;
}

export default function Redirect() {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const prevState = sessionStorage.getItem("oauth_state");
    sessionStorage.removeItem("oauth_state");
    if (!prevState) {
      //console.log("Missing CSRF state!");
      navigate("/");
      return;
    }
    if (state !== prevState) {
      //console.log("Possible CSRF attempt!");
      navigate("/");
      return;
    }
    fortyTwoSign({ code: code, state: state })
      .then((res) => {
        const token = res.data.access_token;
        const tokenInfo: DecodedToken = jwt_decode(token); //can throw InvalidTokenError
        if (tokenInfo.fullyAuth) {
          navigate("/app");
        } else {
          navigate("/mfa-signin");
        }
      })
      .catch((e) => {
        //console.log("error in Redirect():", e);
        navigate("/signup");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="login__container"></div>;
}
