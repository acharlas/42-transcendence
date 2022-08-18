import { AdaptiveDpr, OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Box from "./componants/Box";
import Plane from "./componants/Plane";
import loginService from "./login/Login_page_component";
import "./style.css";

function App() {
  let signinStatus = loginService.useSigninStatus(
    window.sessionStorage.getItem("Token") === null ? false : true
  );

  return signinStatus.isSignin === true ? (
    <Routes>
      <Route path="/">
        <div>
          <route exact path="/"></route>
          <button id="logout" onClick={signinStatus.Signout}>
            Signout
          </button>
          <div id="game">
            <Canvas camera={{ position: [0, 10, 5], fov: 90 }}>
              <Stats />
              <Stars />
              <Box />
              <Plane />
              <pointLight position={[0, 5, 0]} />
              <ambientLight />
              <AdaptiveDpr />
            </Canvas>
          </div>
        </div>
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route path="/game">
        <loginService.LoginPage Status={signinStatus} />
      </Route>
    </Routes>
  );
}
export default App;
