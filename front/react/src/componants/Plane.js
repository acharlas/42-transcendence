import React from "react";
import { PlaneGeometry } from "three";

export default function Plane() {
    return(
        <mesh position={[0,0,0]}
        rotation={[-Math.PI / 2,0,0]}>
        <planeGeometry args={[25,10]}/>
        <meshStandardMaterial color='blue'/>
        </mesh>
    );
}