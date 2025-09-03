import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { BOSS_FIGHT_LEVEL, COLLISION_GROUPS, COLLISION_MASKS } from "~/constants";
import * as THREE from "three";

export interface EnemyType {
  position: [number, number, 1];
  args: [number, number, number];
  id: string;
  health: number; // percent 0 < health < 100
  rowData: { enemyRow: number; rowNum: number };
  colData: { enemyCol: number; colNum: number };
  attackWaveLevel: number;
}

type EnemyProps = {
  enemy: EnemyType;
  scene: THREE.Group;
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

export default function Enemy({ enemy, scene, attackWaveLevel }: EnemyProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const modelRef = useRef<THREE.Group>(null!);

  const enemyHeight = enemy.args[1];
  const enemyWidth = enemy.args[0];

  const healthFraction =
    enemy.health / (attackWaveLevel === BOSS_FIGHT_LEVEL ? 2000 : attackWaveLevel === 2 ? 200 : 100);
  const healthPositionX = -(enemyWidth * (1 - healthFraction)) / 2;

  const clonedScene = useMemo(() => scene.clone(), [scene]);

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
      {attackWaveLevel !== BOSS_FIGHT_LEVEL ? (
        <>
          <group>
            <primitive
              object={clonedScene}
              scale={[7, 7, 7]}
              rotation={[0, -Math.PI / 2, 0]}
            />

            {attackWaveLevel === 1 ? (
              <pointLight
                color={"#ffffff"}
                intensity={30}
                position={[0, 0, 2]}
              />
            ) : (
              <>
                <pointLight
                  color={"#ffffff"}
                  intensity={60}
                  position={[0, -3, 4]}
                />
              </>
            )}

            {/* enemy health */}
            <mesh
              scale-x={healthFraction}
              position={[healthPositionX, enemyHeight * 0.8, 0.3]}
            >
              <planeGeometry args={[enemyWidth, 0.5]} />
              <meshStandardMaterial
                color={enemy.health > 50 ? "#01CD24" : "#FF6812"}
              />
            </mesh>
          </group>

          <CuboidCollider
            args={[enemy.args[0] / 2, enemy.args[1] / 2, enemy.args[2] / 2]}
          />
        </>
      ) : (
        <>
          <group>
            <primitive
              ref={modelRef}
              object={clonedScene}
              scale={[100, 100, 100]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            {/* lights */}
            <>
              <pointLight
                color={"#ffffff"}
                intensity={400}
                position={[0, -50, 15]}
              />
              <pointLight
                color={"#ffffff"}
                intensity={300}
                position={[30, -40, 20]}
              />
              <pointLight
                color={"#ffffff"}
                intensity={300}
                position={[-30, -40, 20]}
              />
              <pointLight
                color={"#ffffff"}
                intensity={100}
                position={[30, -30, 20]}
              />
              <pointLight
                color={"#ffffff"}
                intensity={100}
                position={[-30, -30, 20]}
              />
              <pointLight
                color={"#ffffff"}
                intensity={100}
                position={[0, -35, 35]}
              />
            </>

            {/* enemy health */}
            <mesh
              scale-x={healthFraction}
              position={[healthPositionX, -enemyHeight * 0.8, 40]}
            >
              <planeGeometry args={[enemyWidth, 1.5]} />
              <meshStandardMaterial
                color={enemy.health > 50 ? "#01CD24" : "#FF6812"}
              />
            </mesh>
          </group>

          <BallCollider args={[enemy.args[0] / 2]} />
        </>
      )}
    </RigidBody>
  );
}
