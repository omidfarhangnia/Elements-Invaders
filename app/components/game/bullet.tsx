import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
  BallCollider,
} from "@react-three/rapier";

export interface AmmoType {
  position: [number, number, 1];
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
};

export default function Bullet({
  bullet,
  owner,
  deleteAmmo,
  onCollision,
}: BulletProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const { viewport } = useThree();
  const bulletHalfHeight = bullet.args[1] / 2;
  const speed = owner === "spaceShip" ? 50 : -60;
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

      const isOutOfRange =
        owner === "spaceShip"
          ? position.y > viewport.height / 2 + bulletHalfHeight
          : position.y < -(viewport.height / 2 + bulletHalfHeight);

      if (isOutOfRange) {
        deleteAmmo(
          bullet.id,
          owner === "spaceShip" ? "spaceShipBullet" : "enemyBullet"
        );
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      lockRotations
      name={rigidBodyName}
      type="dynamic"
      userData={{ id: bullet.id }}
      gravityScale={0}
      position={bullet.position}
      {...(owner === "enemy"
        ? {
            onIntersectionEnter: ({ other }) => {
              if (other.rigidBodyObject?.name === rigidBodyTarget) {
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
}

export function Blaster({ blaster, deleteAmmo, onCollision }: BlasterProps) {
  const { viewport } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const blasterHalfHeight = blaster.args[0];

  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 100, z: 0 }, true);
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
        }
      }}
    >
      <mesh>
        <sphereGeometry
          args={[blaster.args[0], blaster.args[1], blaster.args[2]]}
        />
        <meshBasicMaterial color="red" />
      </mesh>

      <BallCollider args={[blaster.args[0]]} />
    </RigidBody>
  );
}
