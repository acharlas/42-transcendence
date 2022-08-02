import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import keyboardControl from "../hooks/useKeyboardControl";

const SPEED = 0.2

export default function Box() {
    const {forward, backward, left, right} = keyboardControl()
    const boxMesh = useRef();
    useFrame(() => {
        if(boxMesh.current.position.x > -10 )
        {
            boxMesh.current.position.x -= left ? SPEED : 0
        }
        if(boxMesh.current.position.x < 10 )
        {
            boxMesh.current.position.x += right ? SPEED : 0
        }
        if(boxMesh.current.position.z > -5 )
        {
            boxMesh.current.position.z -= forward ? SPEED : 0
        }
        if(boxMesh.current.position.z < 5 )
        {
            boxMesh.current.position.z += backward ? SPEED : 0
        }
    })

    return (
        <mesh
        ref={boxMesh}
        position={[0,0,0]}>
            <sphereGeometry args={[0.3]}/>
            <meshStandardMaterial color={'orange'}/>
        </mesh>
    );
}