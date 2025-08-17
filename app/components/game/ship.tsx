import { useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { type Ref } from "react";

type ShipProps = {
  startTheGunfire: () => void;
  stopTheGunefire: () => void;
  ref: Ref<RapierRigidBody>;
  onCollision: () => void;
  isShipInvisible: boolean;
};

export default function Ship({
  startTheGunfire,
  stopTheGunefire,
  ref,
  onCollision,
  isShipInvisible,
}: ShipProps) {
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
        onPointerDown={startTheGunfire}
        onPointerUp={stopTheGunefire}
        onPointerLeave={stopTheGunefire}
        position={[0, 0, 1]}
        scale={1}
      >
        <boxGeometry args={[5, 5, 1]} />
        <meshStandardMaterial
          color="blue"
          opacity={isShipInvisible ? 0.3 : 1.0}
          transparent
        />
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

interface ShipEngineProps {
  shipEngine: number; // 0 < shipEngine < 100
}

export function ShipEngine({ shipEngine }: ShipEngineProps) {
  const { viewport } = useThree();

  const engineBarWidth = 10;
  const engineBarHeight = 25;

  const engineFraction = shipEngine / 100;
  const enginePositionY = -(engineBarHeight * (1 - engineFraction)) / 2;

  return (
    <group
      position={[
        (viewport.width - engineBarWidth - 8) / 2,
        (engineBarHeight - viewport.height + 12) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[engineBarWidth, engineBarHeight + 4]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
      <mesh position={[0, enginePositionY, 0.2]} scale-y={engineFraction}>
        <planeGeometry
          scale={[0, 0]}
          args={[engineBarWidth - 4, engineBarHeight]}
        />
        <meshBasicMaterial
          color={shipEngine < 40 ? "lime" : shipEngine < 80 ? "orange" : "red"}
        />
      </mesh>
    </group>
  );
}
