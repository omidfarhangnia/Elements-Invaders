import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
  BallCollider,
  interactionGroups,
} from "@react-three/rapier";
import { COLLISION_GROUPS, COLLISION_MASKS } from "~/constants";
import { useAppSelector } from "~/RTK/hook";

export type Position = [number, number, 1];

export interface AmmoType {
  position: Position;
  args: [number, number, number];
  color: string;
  id: string;
  type: "bullet" | "blaster";
}

type BulletProps = {
  bullet: AmmoType;
  owner: "spaceShip" | "enemy";
  deleteAmmo: (
    id: string,
    ammoType: "spaceShipBullet" | "enemyBullet" | "spaceShipBlaster"
  ) => void;
  onCollision: (
    id: string,
    enemyId?: string,
    ammoType?: "spaceShipBullet" | "spaceShipBlaster"
  ) => void;
  onCollisionToShield?: (bulletId: string) => void;
};

export default function Bullet({
  bullet,
  owner,
  deleteAmmo,
  onCollision,
  onCollisionToShield,
}: BulletProps) {
  const isShieldActive = useAppSelector((state) => state.game.isShieldActive);
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const { viewport } = useThree();
  const bulletHalfHeight = bullet.args[1] / 2;
  const speed = owner === "spaceShip" ? 30 : -30;
  const rigidBodyName = owner === "spaceShip" ? "bullet" : "enemyBullet";
  const rigidBodyTarget = owner === "spaceShip" ? "enemy" : "spaceShip";

  useEffect(() => {
    if (rigidBodyRef.current) {
      const impulse = { x: 0, y: speed, z: 0 };
      rigidBodyRef.current.applyImpulse(impulse, true);
    }
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const position = rigidBodyRef.current.translation();

      if (
        position.y > viewport.height / 2 + bulletHalfHeight ||
        position.y < -(viewport.height / 2 + bulletHalfHeight)
      ) {
        deleteAmmo(
          bullet.id,
          owner === "spaceShip" ? "spaceShipBullet" : "enemyBullet"
        );
      }
    }
  });

  const collisionGroupProps = useMemo(() => {
    if (owner === "spaceShip") {
      return {
        collisionGroups: interactionGroups(
          COLLISION_GROUPS.SPACESHIP_BULLET,
          COLLISION_MASKS.SPACESHIP_BULLET
        ),
      };
    } else {
      return {
        collisionGroups: interactionGroups(
          COLLISION_GROUPS.ENEMY_BULLET,
          COLLISION_MASKS.ENEMY_BULLET
        ),
      };
    }
  }, [owner]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      lockRotations
      name={rigidBodyName}
      type="dynamic"
      userData={{ id: bullet.id }}
      gravityScale={0}
      position={bullet.position}
      {...collisionGroupProps}
      {...(owner === "enemy"
        ? {
            onIntersectionEnter: ({ other }) => {
              if (isShieldActive) {
                if (onCollisionToShield !== undefined) {
                  onCollisionToShield(bullet.id);
                }
                deleteAmmo(other.rigidBodyObject?.userData.id, "enemyBullet");
              } else if (other.rigidBodyObject?.name === rigidBodyTarget) {
                onCollision(bullet.id);
              }
            },
          }
        : {
            onCollisionEnter: ({ other }) => {
              if (other.rigidBodyObject?.name === rigidBodyTarget) {
                onCollision(
                  bullet.id,
                  other.rigidBodyObject.userData.id as string,
                  "spaceShipBullet"
                );
              } else if (other.rigidBodyObject?.name === "enemyBullet") {
                deleteAmmo(bullet.id, "spaceShipBullet");
                deleteAmmo(other.rigidBodyObject.userData.id, "enemyBullet");
              }
            },
          })}
    >
      <mesh>
        <boxGeometry args={bullet.args} />
        <meshStandardMaterial color={bullet.color} />
      </mesh>

      <CuboidCollider
        args={[bullet.args[0] / 2, bullet.args[1] / 2, bullet.args[2] / 2]}
      />
    </RigidBody>
  );
}

interface BlasterProps {
  blaster: AmmoType;
  deleteAmmo: (
    id: string,
    ammoType: "spaceShipBullet" | "enemyBullet" | "spaceShipBlaster"
  ) => void;
  onCollision: (
    id: string,
    enemyId: string,
    ammoType: "spaceShipBullet" | "spaceShipBlaster"
  ) => void;
  deletePowerUp: (powerUpId: string) => void;
}

export function Blaster({
  blaster,
  deleteAmmo,
  onCollision,
  deletePowerUp,
}: BlasterProps) {
  const { viewport } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const blasterHalfHeight = blaster.args[0];

  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 120, z: 0 }, true);
    }
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const position = rigidBodyRef.current.translation();

      if (position.y > viewport.height / 2 + blasterHalfHeight) {
        deleteAmmo(blaster.id, "spaceShipBlaster");
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      name="blaster"
      lockRotations
      userData={{ id: blaster.id }}
      gravityScale={0}
      position={blaster.position}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "enemy") {
          onCollision(
            blaster.id,
            other.rigidBodyObject.userData.id,
            "spaceShipBlaster"
          );
        } else if (other.rigidBodyObject?.name === "enemyBullet") {
          deleteAmmo(other.rigidBodyObject.userData.id, "enemyBullet");
        } else if (other.rigidBodyObject?.name === "powerUp") {
          deletePowerUp(other.rigidBodyObject.userData.id);
        }
      }}
    >
      <group>
        <mesh>
          <octahedronGeometry args={[blaster.args[0], blaster.args[1]]} />
          <meshBasicMaterial color={"#ff5d00"} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.5, 0.1, 8, 16]} />
          <meshBasicMaterial color={blaster.color} />
        </mesh>
      </group>

      <BallCollider
        args={[blaster.args[0]]}
        collisionGroups={interactionGroups(
          COLLISION_GROUPS.BLASTER,
          COLLISION_MASKS.BLASTER
        )}
      />
    </RigidBody>
  );
}
