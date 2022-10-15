import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import loginService from "./login/login-service"

export function App() {
  let navigate = useNavigate();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };
  const goSettings = () => {
    navigate("/settings");
  }
  const goGame = () => {
    navigate("/game");
  }
  const goChat = () => {
    navigate("/chat");
  }
  const goLeaderboard = () => {
    navigate("/leaderboard");
  }

  useEffect(() => {
    loginService.getMe({ token: window.sessionStorage.getItem("Token") });
  }, [])

  return (
    <div>
      <button onClick={goSignin}>
        signout
      </button>
      <br></br>
      <button onClick={goSettings}>
        settings
      </button>
      <br></br>
      <button onClick={goGame}>
        game
      </button>
      <br></br>
      <button onClick={goChat}>
        chat
      </button>
      <br></br>
      <button onClick={goLeaderboard}>
        leaderboard
      </button>
    </div>
  );
}
export default App;
