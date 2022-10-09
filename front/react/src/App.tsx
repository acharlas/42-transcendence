import { useNavigate } from "react-router-dom";

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
  const goList = () => {
    navigate("/userlist");
  }

  return (
    <div>
      <button id="logout button" onClick={goSignin}>
        Signout
      </button>
      <button id="settings button" onClick={goSettings}>
        settings
      </button>
      <button id="game button" onClick={goGame}>
        game
      </button>
      <button id="chat button" onClick={goChat}>
        chat
      </button>
      <button onClick={goList}>
        userlist
      </button>
    </div>
  );
}
export default App;
