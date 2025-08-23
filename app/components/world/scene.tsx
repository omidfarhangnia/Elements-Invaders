import { useEffect, useRef } from "react";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import SpaceShip, {
  SpaceShipAmmo,
  SpaceShipBulletLevel,
  SpaceShipHealth,
  SpaceShipOverheat,
  SpaceShipShieldState,
} from "../game/space-ship";
import { Surface } from "./surface";
import Bullet, { Blaster } from "../game/bullet";
import Enemy from "../game/enemy";
import type { EnemyArrangements } from "~/routes/lobby";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";
import { initializeEnemies } from "~/features/game/game-slice";
import PowerUp from "../game/powerUp";
import useEnemyShooting from "~/hooks/useEnemyShooting";
import usePowerUp from "~/hooks/usePowerUp";
import useSpaceShipControls from "~/hooks/useSpaceShipControls";
import usePlayerShooting from "~/hooks/usePlayerShooting";
import useCollisionHandler from "~/hooks/useCollisionHandler";

export default function Scene({
  enemyArrangements,
}: {
  enemyArrangements: EnemyArrangements[];
}) {
  const { enemies, bullets, blasters, powerUps, enemiesBullets, gameLevel } =
    useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  /* useRef */
  // including the whole space ship
  const spaceShipRef = useRef<RapierRigidBody>(null!);
  /* useEffect */
  // initial value for enemies
  useEffect(() => {
    dispatch(
      initializeEnemies(
        enemyArrangements[gameLevel.selectedLevel - 1].enemyArrangments
      )
    );
  }, [dispatch, gameLevel.selectedLevel]);

  /* customHook */
  // controlling enemy shoots
  useEnemyShooting([1.5, 1.5, 1.5], "green");
  // add power up
  usePowerUp();
  // controling space ship
  const { handlePointerMove, mousePosRef } = useSpaceShipControls(spaceShipRef);
  // player shooting logic
  const {
    handlePointerDownLeftClick,
    handlePointerDownRightClick,
    handlePointerUpOnSpaceShip,
  } = usePlayerShooting(mousePosRef);
  // all collision control here
  const {
    collisionAmmoToEnemy,
    collisionBulletToSpaceShip,
    collisionPowerUpToSpaceShip,
    collisionSpaceShipToEnemy,
    deletePowerUp,
    deleteAmmo,
    collisionBulletToShield,
  } = useCollisionHandler();

  return (
    <Physics debug>
      <OrbitControls makeDefault />
      <ambientLight intensity={Math.PI / 2} />
      <SpaceShipHealth />
      <SpaceShipOverheat />
      <SpaceShipAmmo />
      <SpaceShipBulletLevel />
      <SpaceShipShieldState />
      <SpaceShip
        startTheGunfire={() => handlePointerDownLeftClick([1, 1, 1], "red")}
        shootTheBlaster={() =>
          handlePointerDownRightClick([1, 10, 10], "green")
        }
        stopTheGunfire={handlePointerUpOnSpaceShip}
        ref={spaceShipRef}
        onCollision={collisionSpaceShipToEnemy}
      />
      <Surface moveSpaceShip={handlePointerMove} />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            bullet={bullet}
            owner="spaceShip"
            deleteAmmo={deleteAmmo}
            onCollision={collisionAmmoToEnemy}
          />
        );
      })}
      {blasters.map((blaster) => {
        return (
          <Blaster
            key={blaster.id}
            blaster={blaster}
            deleteAmmo={deleteAmmo}
            deletePowerUp={deletePowerUp}
            onCollision={collisionAmmoToEnemy}
          />
        );
      })}
      {enemiesBullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            bullet={bullet}
            owner="enemy"
            deleteAmmo={deleteAmmo}
            onCollision={collisionBulletToSpaceShip}
            onCollisionToShield={collisionBulletToShield}
          />
        );
      })}
      {enemies.map((enemy) => {
        return <Enemy key={enemy.id} enemy={enemy} />;
      })}
      {powerUps.map((powerUp) => {
        return (
          <PowerUp
            key={powerUp.id}
            powerUp={powerUp}
            deletePowerUp={deletePowerUp}
            onCollision={collisionPowerUpToSpaceShip}
          />
        );
      })}
    </Physics>
  );
}
