import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { type Ref } from "react";
import { v4 as uuidv4 } from "uuid";

type BoxProps = {
  ref: Ref<THREE.Mesh>;
  shootingTheBullet: (
    event: ThreeEvent<MouseEvent>,
    args: [number, number, number],
    color: string
  ) => void;
};

function Box({ shootingTheBullet, ref }: BoxProps) {
  return (
    <mesh
      ref={ref}
      onClick={(e) => shootingTheBullet(e, [1, 1, 1], "red")}
      position={[0, 0, 1]}
      scale={1}
    >
      <boxGeometry args={[5, 5, 1]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}

type SurfaceProps = {
  moveTheShip: (event: ThreeEvent<PointerEvent>) => void;
};

export function Surface({ moveTheShip }: SurfaceProps) {
  const { viewport } = useThree();

  return (
    <mesh
      onPointerMove={moveTheShip}
      position={[0, 0, 0]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry />
      <meshStandardMaterial color={"#D3D3D3"} />
    </mesh>
  );
}

interface Bullet {
  position: [number, number, 1];
  args: [number, number, number];
  color: string;
  id: string;
}

type BulletProps = {
  bullet: Bullet;
  removeOutOfRangeBullets: (id: string) => void;
};

function Bullet({ bullet, removeOutOfRangeBullets }: BulletProps) {
  const bulletRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  const bulletHalfHeight = bullet.args[1] / 2;

  useFrame((_, delta) => {
    bulletRef.current.position.y += 50 * delta;

    if (bulletRef.current.position.y > viewport.height / 2 + bulletHalfHeight) {
      removeOutOfRangeBullets(bullet.id);
    }
  });

  return (
    <mesh ref={bulletRef} position={bullet.position}>
      <boxGeometry args={bullet.args} />
      <meshStandardMaterial color={bullet.color} />
    </mesh>
  );
}

function Scene() {
  const [bullets, setBullets] = useState<Bullet[]>([]);

  const boxRef = useRef<THREE.Mesh>(null!);
  const mousePos = useRef({ x: 0, y: 0 });

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePos.current = { x: event.point.x, y: event.point.y };
  }

  function handleClickBox(
    event: ThreeEvent<MouseEvent>,
    args: [number, number, number],
    color: string
  ) {
    setBullets((bullets) => [
      ...bullets,
      {
        position: [event.point.x, event.point.y, 1],
        args,
        color,
        id: uuidv4(),
      },
    ]);
  }

  function handleDeleteBullet(id: string) {
    setBullets((currentBullets) =>
      currentBullets.filter((bullet) => bullet.id !== id)
    );
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
      <Box ref={boxRef} shootingTheBullet={handleClickBox} />
      <Surface moveTheShip={handlePointerMove} />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            bullet={bullet}
            removeOutOfRangeBullets={handleDeleteBullet}
          />
        );
      })}
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
