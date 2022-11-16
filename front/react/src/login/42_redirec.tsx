import { useNavigate, useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

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
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  fortyTwoSign({ code: code, state: state })
    .then((res) => {
      const token = res.data.access_token;
      const tokenInfo: DecodedToken = jwt_decode(token); //can throw InvalidTokenError
      if (tokenInfo.fullyAuth) { navigate("/app"); }
      else { navigate("/mfa-signin"); }
    })
    .catch((e) => {
      console.log("error in Redirect():", e);
      navigate("/");
    });
  return <div className="login__container"></div>;
}
