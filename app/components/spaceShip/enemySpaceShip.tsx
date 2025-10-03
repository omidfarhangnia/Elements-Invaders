import { BallCollider, CuboidCollider } from "@react-three/rapier";
import { BOSS_FIGHT_LEVEL } from "~/constants";
import type { EnemyProps } from "../game/enemy";
import EnemySpaceShipModel1 from "./enemySpaceShipModel1";
import EnemySpaceShipModel2 from "./enemySpaceShipModel2";

export default function EnemySpaceShip({ enemy, attackWaveLevel }: EnemyProps) {
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

  return (
    <>
      {attackWaveLevel !== BOSS_FIGHT_LEVEL ? (
        <>
          <group>
            {/* enemy space ship */}
            {attackWaveLevel === 1 ? (
              <EnemySpaceShipModel1 />
            ) : (
              <EnemySpaceShipModel2 />
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
          {/* enemy hitbox */}
          <CuboidCollider
            args={[enemy.args[0] / 2, enemy.args[1] / 2, enemy.args[2] / 2]}
          />
        </>
      ) : (
        <>
          <group>
            {/* <primitive
              ref={modelRef}
              object={clonedScene}
              scale={[100, 100, 100]}
              rotation={[Math.PI / 2, 0, 0]}
            /> */}
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
    </>
  );
}
