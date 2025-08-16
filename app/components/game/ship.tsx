import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef, type Ref } from "react";
import * as THREE from "three";

type ShipProps = {
  ref: Ref<RapierRigidBody>;
  shootingTheBullet: (
    event: ThreeEvent<MouseEvent>,
    args: [number, number, number],
    color: string
  ) => void;
  onCollision: () => void;
  isShipInvisible: boolean;
};

export default function Ship({
  shootingTheBullet,
  ref,
  onCollision,
  isShipInvisible,
}: ShipProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // useFrame((state) => {
  //   if (!meshRef.current) return;

  //   const material = meshRef.current.material as THREE.MeshStandardMaterial;

  //   if (isShipInvisible) {
  //     material.transparent = true;
  //     const time = state.clock.getElapsedTime();
  //     const frequency = 10;
  //     const minOpacity = 0.2;
  //     const maxOpacity = 1;

  //     material.opacity = (Math.sin(time * frequency) + 1) / 2 * (maxOpacity - minOpacity) + minOpacity;
  //   } else {
  //     if (material.transparent) {
  //       material.transparent = false;
  //       material.opacity = 1;
  //     }
  //   }
  // });

  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      gravityScale={0}
      colliders={false}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "enemy") {
          onCollision();
        }
      }}
    >
      <mesh
        ref={meshRef}
        onClick={(e) => shootingTheBullet(e, [1, 1, 1], "red")}
        position={[0, 0, 1]}
        scale={1}
      >
        <boxGeometry args={[5, 5, 1]} />
        <meshStandardMaterial color={"blue"} transparent />
      </mesh>

      <CuboidCollider args={[2.5, 2.5, 0.5]} sensor />
    </RigidBody>
  );
}

interface ShipHealth {
  shipHealth: number;
}

export function ShipHealth({ shipHealth }: ShipHealth) {
  const { viewport } = useThree();

  const healthBarWidth = 25;
  const healthBarHeight = 5;

  const healthFraction = shipHealth / 100;
  const healthPostionX = -(healthBarWidth * (1 - healthFraction)) / 2;

  return (
    <group
      position={[
        (healthBarWidth - viewport.width + 8) / 2,
        (healthBarHeight - viewport.height + 8) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[healthBarWidth, healthBarHeight]} />
        <meshBasicMaterial color="pink" />
      </mesh>
      <mesh scale-x={healthFraction} position={[healthPostionX, 0, 0.3]}>
        <planeGeometry args={[healthBarWidth - 5, healthBarHeight - 3]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
}
