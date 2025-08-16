import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export interface EnemyType {
  position: [number, number, 1];
  args: [number, number, number];
  color: string;
  id: string;
  health: number; // percent 0 < health < 100
}

type EnemyProps = {
  enemy: EnemyType;
};

export default function Enemy({ enemy }: EnemyProps) {
  const enemyRef = useRef<THREE.Mesh>(null!);

  const enemyHeight = enemy.args[1];
  const enemyWidth = enemy.args[0];

  return (
    <RigidBody
      type="fixed"
      name="enemy"
      userData={{ id: enemy.id }}
      position={enemy.position}
    >
      <group ref={enemyRef}>
        {/* enemy ship */}
        <mesh>
          <boxGeometry args={enemy.args} />
          <meshStandardMaterial color={enemy.color} />
        </mesh>

        {/* enemy health */}
        <group position={[0, enemyHeight, 0]}>
          <mesh>
            <planeGeometry args={[enemyWidth + 1, 1]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <planeGeometry args={[enemyWidth, 0.5]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </group>
      </group>

      <CuboidCollider
        args={[enemy.args[0] / 2, enemy.args[1] / 2, enemy.args[2] / 2]}
      />
    </RigidBody>
  );
}
