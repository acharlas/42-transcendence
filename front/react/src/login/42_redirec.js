import { useSearchParams } from "react-router-dom";
import "../style.css";
import loginService from "./login-service";

export default function Redirect() {
  const [searchParams, setSearchParams] = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  try {
    loginService.fortyTwoSign({ code: code, state: state });
    return <div className="container"></div>;
  } catch (e) {
    console.log("error:", { e });
  }
}
