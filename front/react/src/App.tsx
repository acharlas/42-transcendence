import { useNavigate } from "react-router-dom";

export function App() {
  let navigate = useNavigate();
  const goSignin = () => {
    window.localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
    </div>
  );
}
export default App;
