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
  removeOutOfRangeBullets: (id: string) => void;
  onCollision: (id: string, otherOjb: string) => void;
};

export default function Bullet({
  bullet,
  removeOutOfRangeBullets,
  onCollision,
}: BulletProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const { viewport } = useThree();
  const bulletHalfHeight = bullet.args[1] / 2;

  useEffect(() => {
    if (rigidBodyRef.current) {
      const impulse = { x: 0, y: 50, z: 0 };
      rigidBodyRef.current.applyImpulse(impulse, true);
    }
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const position = rigidBodyRef.current.translation();
      if (position.y > viewport.height / 2 + bulletHalfHeight) {
        removeOutOfRangeBullets(bullet.id);
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      gravityScale={0}
      position={bullet.position}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "enemy") {
          onCollision(bullet.id, other.rigidBodyObject.userData.id);
        }
      }}
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
