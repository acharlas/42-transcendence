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
        navigate("/game");
      })
      .catch((err) => {
        console.log("error:", { err });
        navigate("/");
      });
  return <div className="container"></div>;
}
