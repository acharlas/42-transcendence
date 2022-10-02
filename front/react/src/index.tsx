import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { SignupForm } from "./login/signup_component";
import { SigninForm } from "./login/signin_component";
import Redirect from "./login/42_redirec";
import MfaSetupInit from "./mfa/mfa_setup_init_component";
import MfaSetupValidate from "./mfa/mfa_setup_validate_component";
import MfaSignin from "./mfa/mfa_signin_component";
import Chat from "./chat/chat";
import Settings from "./settings/settings_component";
import Profile from "./profile/profile_component";

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
      <Route path="/home" element={<App />} />
      <Route path="/game" element={<App />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/mfa-init-setup" element={< MfaSetupInit />} />
      <Route path="/settings/mfa-finish-setup" element={< MfaSetupValidate />} />
      <Route path="/profile/:id" element={< Profile />} />
    </Routes>
  </BrowserRouter>
);
