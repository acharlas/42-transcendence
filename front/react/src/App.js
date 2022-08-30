import { AdaptiveDpr, OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import MessageInput from "./chat/chat";
import Box from "./componants/Box";
import Plane from "./componants/Plane";
import "./style.css";

function App() {
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
  );
}
export default App;
