import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import Box from "./componants/Box"
import "./style.css"


function App() {
  return (
    <Canvas>
      <OrbitControls/>
      <Stars/>
      <Box/>
      <pointLight position={[10,10,10]}/>
      <ambientLight/>
    </Canvas>
  );
}

export default App;
