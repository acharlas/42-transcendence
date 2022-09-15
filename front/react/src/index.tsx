import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { SigninForm } from "./login/signin_component";
import { SignupForm } from "./login/signup_component";
import Redirect from "./login/42_redirec";
import Sms2faConfirm from "./mfa/mfa_confirm_component";
import Sms2faChallenge from "./mfa/mfa_challenge_component";
//import Chat from "./chat/chat";
//<Route path="/chat" element={<Chat />} />

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SigninForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/game" element={<App />} />
      <Route path="/42-redirect" element={<Redirect />} />
      <Route path="/sms-confirm" element={<Sms2faConfirm />} />
      <Route path="/sms-verify" element={<Sms2faChallenge />} />
    </Routes>
  </BrowserRouter>
);
