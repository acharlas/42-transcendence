import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import SigninForm from "./login/signin_component";
import { SignupForm } from "./login/signup_component";
import Redirect from "./login/42_redirec";
import MfaSignin from "./login/login_mfa_component";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SigninForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/42-redirect" element={<Redirect />} />
      <Route path="/mfa-signin/" element={<MfaSignin />} />
      <Route path="/app/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
