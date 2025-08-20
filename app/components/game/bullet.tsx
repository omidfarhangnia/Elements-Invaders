import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
} from "@react-three/rapier";

export interface BulletType {
  position: [number, number, 1];
  args: [number, number, number];
  color: string;
  id: string;
}

type BulletProps = {
  bullet: BulletType;
  owner: "spaceShip" | "enemy";
  deleteBullet: (id: string, bulletOwner: "spaceShip" | "enemy") => void;
  onCollision: (id: string, otherOjb: string) => void;
};

export default function Bullet({
  bullet,
  owner,
  deleteBullet,
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
        deleteBullet(bullet.id, owner);
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
                onCollision(bullet.id, other.rigidBodyObject.userData.id);
              }
            },
          }
        : {
            onCollisionEnter: ({ other }) => {
              if (other.rigidBodyObject?.name === rigidBodyTarget) {
                onCollision(bullet.id, other.rigidBodyObject.userData.id);
              } else if (other.rigidBodyObject?.name === "enemyBullet") {
                deleteBullet(bullet.id, "spaceShip");
                deleteBullet(other.rigidBodyObject.userData.id, "enemy");
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
