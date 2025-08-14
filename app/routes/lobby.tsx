import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Box({ shipPosition }) {
  return (
    <mesh
      onClick={() => console.log("you clicked")}
      scale={1}
      position={shipPosition}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}

export function Surface({ handleMouseMove }) {
  const { viewport } = useThree();

  return (
    <mesh
      onPointerMove={handleMouseMove}
      position={[0, 0, 0]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry />
      <meshStandardMaterial color={"#D3D3D3"} />
    </mesh>
  );
}

function Scene() {
  const [shipPosition, setShipPosition] = useState([0, 0, 1]);

  function handleMouseMove(event) {
    event.stopPropagation();
    setShipPosition([event.point.x, event.point.y, 1]);
  }
  return (
    <>
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <Box shipPosition={shipPosition} />
      <Surface handleMouseMove={handleMouseMove} />
    </>
  );
}

export default function Lobby() {
  return (
    <div className="w-full h-[100vh]">
      <Canvas
        camera={{
          position: [0, 0, 100],
          fov: 75,
          near: 0.1,
          // far: 110,
          far: 300,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
