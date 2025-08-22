import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { COLLISION_GROUPS, COLLISION_MASKS } from "~/constants";

export interface EnemyType {
  position: [number, number, 1];
  args: [number, number, number];
  color: string;
  id: string;
  health: number; // percent 0 < health < 100
  rowData: { enemyRow: number; rowNum: number };
  colData: { enemyCol: number; colNum: number };
}

type EnemyProps = {
  enemy: EnemyType;
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

export default function Enemy({ enemy }: EnemyProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);

  const enemyHeight = enemy.args[1];
  const enemyWidth = enemy.args[0];

  const healthFraction = enemy.health / 100;
  const healthPositionX = -(enemyWidth * (1 - healthFraction)) / 2;

  useFrame((state) => {
    if (rigidBodyRef.current) {
      const time = state.clock.getElapsedTime();

      const rowMoveSpeed = 1.2;
      const rowMoveSize = 0.6;
      const colMoveSpeed = 1.2;
      const colMoveSize = 1;
      const newPosition = {
        x:
          enemy.position[0] +
          Math.sin(time * rowMoveSpeed + enemy.position[0]) *
            rowMoveSize *
            calcWhereSideIs(enemy.colData),
        y:
          enemy.position[1] +
          Math.sin(time * colMoveSpeed + enemy.position[1]) * colMoveSize,
        z: enemy.position[2],
      };

      rigidBodyRef.current.setNextKinematicTranslation(newPosition);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      name="enemy"
      userData={{ id: enemy.id }}
      position={enemy.position}
      collisionGroups={interactionGroups(
        COLLISION_GROUPS.ENEMY,
        COLLISION_MASKS.ENEMY
      )}
    >
      <group>
        {/* enemy space ship */}
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
          <mesh scale-x={healthFraction} position={[healthPositionX, 0, 0.3]}>
            <planeGeometry args={[enemyWidth, 0.5]} />
            <meshStandardMaterial
              color={enemy.health > 50 ? "green" : "orange"}
            />
          </mesh>
        </group>
      </group>

      <CuboidCollider
        args={[enemy.args[0] / 2, enemy.args[1] / 2, enemy.args[2] / 2]}
        sensor
      />
    </RigidBody>
  );
}
