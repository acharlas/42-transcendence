import { useNavigate, useSearchParams } from "react-router-dom";
import "../style.css";
import loginService from "./login-service";

export default function Redirect() {
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  loginService
    .fortyTwoSign({ code: code, state: state })
    .then((ret) => {
      navigate("/game");
    })
    .catch((err) => {
      console.log("error:", { e });
      navigate("/");
    });
  return <div className="container"></div>;
}
