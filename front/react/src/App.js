import { AdaptiveDpr, OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import Box from "./componants/Box"
import Plane from "./componants/Plane";
import "./style.css"



function App() {
  return (
    <Canvas camera={{position: [0,10,5], fov: 90}} >
      <Stats/>
      <Stars/>
      <Box/>
      <Plane/>
      <pointLight position={[0,5,0]}/>
      <ambientLight/>
      <AdaptiveDpr/>
    </Canvas>
  );
}

export default App;
