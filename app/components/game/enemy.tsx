import { useFrame } from "@react-three/fiber";
import {
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import {
  BOSS_FIGHT_LEVEL,
  COLLISION_GROUPS,
  COLLISION_MASKS,
} from "~/constants";
import * as THREE from "three";
import EnemySpaceShip from "../spaceShip/enemySpaceShip";

export interface EnemyType {
  position: [number, number, 1];
  args: [number, number, number];
  id: string;
  health: number; // percent 0 < health < 100
  rowData: { enemyRow: number; rowNum: number };
  colData: { enemyCol: number; colNum: number };
  attackWaveLevel: number;
}

export type EnemyProps = {
  enemy: EnemyType;
  attackWaveLevel: number;
};

function calcWhereSideIs(colData: EnemyType["colData"]): -1 | 0 | 1 {
  if (colData.colNum % 2 === 0) {
    // even has no middle
    if (colData.enemyCol < colData.colNum / 2) {
      // left
      return -1;
    } else {
      // right
      return 1;
    }
  } else {
    // odd has middle
    if (colData.enemyCol === Math.ceil(colData.colNum / 2) - 1) {
      // middle
      return 0;
    } else if (colData.enemyCol < colData.colNum / 2 - 1) {
      // left
      return -1;
    } else {
      return 1;
    }
  }
}

export default function Enemy({ enemy, attackWaveLevel }: EnemyProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const modelRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (rigidBodyRef.current) {
      const time = state.clock.getElapsedTime();

      const rowMoveSpeed = 1.2;
      const rowMoveSize = 0.6;
      const colMoveSpeed = 1.2;
      const colMoveSize = 1;
      const targetPosition = new THREE.Vector3(
        enemy.position[0] +
          Math.sin(time * rowMoveSpeed + enemy.position[0]) *
            rowMoveSize *
            calcWhereSideIs(enemy.colData),
        enemy.position[1] +
          Math.sin(time * colMoveSpeed + enemy.position[1]) * colMoveSize,
        enemy.position[2]
      );

      const currentPosition = new THREE.Vector3().copy(
        rigidBodyRef.current.translation()
      );
      const direction = targetPosition.sub(currentPosition);

      const velocity = direction.normalize().multiplyScalar(1);

      rigidBodyRef.current.setLinvel(
        { x: velocity.x, y: velocity.y, z: 0 },
        true
      );
    }

    if (modelRef.current && attackWaveLevel === BOSS_FIGHT_LEVEL) {
      modelRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      lockTranslations
      lockRotations={attackWaveLevel !== BOSS_FIGHT_LEVEL}
      name="enemy"
      userData={{ id: enemy.id }}
      colliders={false}
      position={enemy.position}
      collisionGroups={interactionGroups(
        COLLISION_GROUPS.ENEMY,
        COLLISION_MASKS.ENEMY
      )}
    >
      {/* enemy space ship */}
      <EnemySpaceShip enemy={enemy} attackWaveLevel={attackWaveLevel} />
    </RigidBody>
  );
}
