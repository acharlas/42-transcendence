import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import SigninForm from "./login/signin_component";
import SignupForm from "./login/signup_component";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/game" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
