import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useMemo, useRef } from "react";
import {
  BOSS_FIGHT_LEVEL,
  COLLISION_GROUPS,
  COLLISION_MASKS,
} from "~/constants";
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

function EnemySpaceShipModel1() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 4, 1]} />
        <meshStandardMaterial color="#b00008" opacity={1} transparent={true} />
      </mesh>
      <EnemySpaceShipFrontSection />
      <EnemySpaceShipSideSection sideDir={"right"} />
      <EnemySpaceShipSideSection sideDir={"left"} />
      <EnemySpaceShipGlass />
    </group>
  );
}

function EnemySpaceShipGlass() {
  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      // layer 1
      0.25, 0.7, 0.5, 0, 0.7, 0.5, -0.25, 0.7, 0.5, 0.25, 0.68, 0.8, 0, 0.68,
      0.8, -0.25, 0.68, 0.8,
      // layer 2
      0.45, 0.4, 0.5, -0.45, 0.4, 0.5, 0.4, 0.4, 0.9, 0, 0.4, 0.9, -0.4, 0.4,
      0.9,
      // layer 3
      0.45, -0.3, 0.5, -0.45, -0.3, 0.5, 0.4, -0.3, 0.9, 0, -0.3, 0.95, -0.4,
      -0.3, 0.9,
      // layer 4
      0.35, -1, 0.5, -0.35, -1, 0.5, 0.3, -1, 0.9, 0, -1, 0.9, -0.3, -1, 0.9,
      // layer 5
      0.1, -1.3, 0.5, -0.1, -1.3, 0.5, 0.1, -1.25, 0.8, -0.1, -1.25, 0.8,
    ]);

    const indices = new Uint16Array([
      0, 1, 3, 1, 4, 3, 1, 2, 4, 2, 5, 4, 0, 3, 6, 3, 8, 6, 3, 9, 8, 3, 4, 9, 4,
      5, 9, 5, 10, 9, 5, 2, 10, 2, 7, 10, 6, 8, 11, 8, 13, 11, 8, 9, 13, 9, 14,
      13, 9, 10, 14, 10, 15, 14, 10, 7, 15, 7, 12, 15, 11, 13, 16, 13, 18, 16,
      13, 14, 18, 14, 19, 18, 14, 15, 19, 15, 20, 19, 15, 12, 20, 12, 17, 20,
      16, 18, 21, 18, 23, 21, 18, 19, 23, 19, 24, 23, 19, 20, 24, 20, 17, 24,
      17, 22, 24, 23, 22, 21, 23, 24, 22,
    ]);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, []);
  return (
    <>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={"#02002f"} />
      </mesh>
    </>
  );
}

function EnemySpaceShipSideSection({ sideDir }: { sideDir: "left" | "right" }) {
  const isRight = sideDir === "right";

  return (
    <group>
      <mesh
        position={[1.7 * (isRight ? 1 : -1), 0.2, 0]}
        rotation={[0, 0, (Math.PI / 2.85) * (isRight ? 1 : -1)]}
      >
        <cylinderGeometry args={[0.2, 0.2, 2.1, 8]} />
        <meshBasicMaterial color={"#0c0606"} />
      </mesh>
      <mesh position={[2.8 * (isRight ? 1 : -1), -1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2.7, 8]} />
        <meshBasicMaterial color={"#b00008"} />
      </mesh>
      <mesh position={[2.8 * (isRight ? 1 : -1), -2.5, 0]}>
        <icosahedronGeometry args={[0.35, 12]} />
        <meshBasicMaterial color={"#b00008"} />
      </mesh>
    </group>
  );
}

function EnemySpaceShipFrontSection() {
  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      //  layer 1
      1.0, -1.2, 0.5, 0.0, -1.2, 0.5, -1.0, -1.2, 0.5, 1.0, -1.2, -0.5, 0.0,
      -1.2, -0.5, -1.0, -1.2, -0.5,
      // layer 2
      0.9, -1.8, 0.4, 0.0, -1.8, 0.4, -0.9, -1.8, 0.4, 0.9, -1.8, -0.4, 0.0,
      -1.8, -0.4, -0.9, -1.8, -0.4,
      // layer 3
      0.8, -2.4, 0.3, 0.0, -2.4, 0.3, -0.8, -2.4, 0.3, 0.8, -2.4, -0.3, 0.0,
      -2.4, -0.3, -0.8, -2.4, -0.3,
      // layer 4
      0.6, -3.0, 0.2, 0.0, -3.0, 0.2, -0.6, -3.0, 0.2, 0.6, -3.0, -0.2, 0.0,
      -3.0, -0.2, -0.6, -3.0, -0.2,
      // layer 5
      0.3, -3.4, 0.05, 0.0, -3.5, 0.05, -0.3, -3.4, 0.05, 0.3, -3.4, -0.05, 0.0,
      -3.5, -0.05, -0.3, -3.4, -0.05,
    ]);

    const indices = new Uint16Array([
      0, 6, 3, 3, 6, 9, 7, 6, 0, 0, 1, 7, 7, 1, 2, 7, 2, 8, 2, 5, 8, 5, 11, 8,
      5, 4, 11, 4, 10, 11, 3, 10, 4, 3, 9, 10, 9, 6, 12, 9, 12, 15, 6, 7, 12, 7,
      13, 12, 7, 8, 13, 8, 14, 13, 8, 11, 14, 14, 11, 17, 11, 16, 17, 11, 10,
      16, 10, 9, 16, 9, 15, 16, 15, 12, 21, 18, 21, 12, 12, 13, 18, 13, 19, 18,
      14, 19, 13, 14, 20, 19, 17, 20, 14, 20, 17, 23, 17, 16, 23, 16, 22, 23,
      16, 15, 22, 15, 21, 22, 20, 23, 26, 23, 29, 26, 23, 22, 29, 22, 28, 29,
      22, 27, 28, 22, 21, 27, 21, 18, 27, 18, 24, 27, 18, 19, 24, 19, 25, 24,
      19, 26, 25, 19, 20, 26, 24, 25, 27, 25, 28, 27, 25, 26, 28, 26, 29, 28,
    ]);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={"#b00008"} />
    </mesh>
  );
}


export default function Enemy({ enemy, scene, attackWaveLevel }: EnemyProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const modelRef = useRef<THREE.Group>(null!);

  const enemyHeight = enemy.args[1];
  const enemyWidth = enemy.args[0];

  const healthFraction =
    enemy.health /
    (attackWaveLevel === BOSS_FIGHT_LEVEL
      ? 2000
      : attackWaveLevel === 2
        ? 200
        : 100);
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
            <EnemySpaceShipModel1 />
            {/* <primitive
              object={clonedScene}
              scale={[7, 7, 7]}
              rotation={[0, -Math.PI / 2, 0]}
            /> */}
            {/* {attackWaveLevel === 1 ? (
              <pointLight
                color={"#ffffff"}
                intensity={4}
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
            )} */}

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
