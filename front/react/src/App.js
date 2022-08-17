import { AdaptiveDpr, OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import Box from "./componants/Box";
import Plane from "./componants/Plane";
import loginService from "./LoginPage/Login_page_component";
import "./style.css";

function App() {
  let signinStatus = loginService.useSigninStatus(
    window.sessionStorage.getItem("Token") === null ? false : true
  );

  return signinStatus.isSignin === true ? (
    <div>
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
  ) : (
    <div>
      <loginService.LoginPage Status={signinStatus} />
    </div>
  );
}
export default App;
