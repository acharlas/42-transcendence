import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";


export default function Box() {
    const boxMesh = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (boxMesh.current.rotation.x += 0.01))
    useFrame((state, delta) => (boxMesh.current.rotation.y += 0.02))

    return (
        <mesh
        ref={boxMesh}
        scale={active ? 1.5 : 1}
        onClick={(event)=> setActive(!active)}
        onPointerOver={(event) => setHovered(true)}
        onPointerOut={(event) => setHovered(false)}>
            <boxGeometry args={[1,1,1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>

        </mesh>
    );
}