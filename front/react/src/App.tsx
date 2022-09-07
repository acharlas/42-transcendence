import { useNavigate } from "react-router-dom";

export function App() {
  let navigate = useNavigate();
  const goSignin = () => {
    window.sessionStorage.clear();
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
