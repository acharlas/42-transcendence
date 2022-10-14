import { useNavigate, useSearchParams } from "react-router-dom";
import loginService from "./login-service";

export default function Redirect() {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (code && state)
    loginService
      .fortyTwoSign({ code: code, state: state })
      .then(() => {
        navigate("/home");
      })
      .catch((e) => {
        if (e.response.data.message === "2FA required") {
          navigate("/mfa-signin");
          return;
        }
        console.log("error:", e);
        navigate("/");
      });
  return <div className="container"></div>;
}
