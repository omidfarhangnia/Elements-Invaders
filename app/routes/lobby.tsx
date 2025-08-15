import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { type Ref } from "react";

type BoxProps = {
  ref: Ref<THREE.Mesh>;
  handleClickBox: (event: ThreeEvent<MouseEvent>) => void;
};

function Box({ handleClickBox, ref }: BoxProps) {
  return (
    <mesh ref={ref} onClick={handleClickBox} position={[0, 0, 1]} scale={1}>
      <boxGeometry args={[5, 5, 1]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}

type SurfaceProps = {
  handlePointerMove: (event: ThreeEvent<PointerEvent>) => void;
};

export function Surface({ handlePointerMove }: SurfaceProps) {
  const { viewport } = useThree();

  return (
    <mesh
      onPointerMove={handlePointerMove}
      position={[0, 0, 0]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry />
      <meshStandardMaterial color={"#D3D3D3"} />
    </mesh>
  );
}

function Scene() {
  const boxRef = useRef<THREE.Mesh>(null!);
  const mousePos = useRef({ x: 0, y: 0 });

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePos.current = { x: event.point.x, y: event.point.y };
  }

  function handleClickBox(event: ThreeEvent<MouseEvent>) {
    console.log("hello there");
  }

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.position.x = mousePos.current.x;
      boxRef.current.position.y = mousePos.current.y;
    }
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <Box ref={boxRef} handleClickBox={handleClickBox} />
      <Surface handlePointerMove={handlePointerMove} />
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
