import { useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { COLLISION_GROUPS, COLLISION_MASKS } from "~/constants";
import type { PowerUpType } from "~/features/game/game-slice";

interface PowerUpProps {
  powerUp: PowerUpType;
  deletePowerUp: (powerUpId: string) => void;
  onCollision: (powerUp: PowerUpType) => void;
}

export default function PowerUp({
  powerUp,
  deletePowerUp,
  onCollision,
}: PowerUpProps) {
  const { viewport } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const powerUpHalfHeight = powerUp.args[0] / 2;

  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: -40, z: 0 }, true);
    }
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const position = rigidBodyRef.current.translation();

      if (position.y < -(viewport.height / 2 + powerUpHalfHeight)) {
        deletePowerUp(powerUp.id);
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      name="powerUp"
      type="dynamic"
      lockRotations
      userData={{ id: powerUp.id }}
      gravityScale={0}
      position={powerUp.position}
      collisionGroups={interactionGroups(
        COLLISION_GROUPS.POWERUP,
        COLLISION_MASKS.POWERUP
      )}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "spaceShip") {
          onCollision(powerUp);
        }
      }}
    >
      <mesh>
        <octahedronGeometry args={powerUp.args} />
        <meshStandardMaterial color={powerUp.color} />
      </mesh>
      <BallCollider args={[powerUp.args[0]]} />
    </RigidBody>
  );
}
