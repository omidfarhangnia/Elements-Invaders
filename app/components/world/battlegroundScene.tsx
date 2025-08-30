import { useEffect, useRef } from "react";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { Surface } from "./surface";
import Bullet, { Blaster } from "../game/bullet";
import Enemy from "../game/enemy";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";
import { initializeEnemies } from "~/features/game/game-slice";
import PowerUp from "../game/powerUp";
import useEnemyShooting from "~/hooks/useEnemyShooting";
import usePowerUp from "~/hooks/usePowerUp";
import useSpaceShipControls from "~/hooks/useSpaceShipControls";
import usePlayerShooting from "~/hooks/usePlayerShooting";
import useCollisionHandler from "~/hooks/useCollisionHandler";
import { enemyArrangements } from "~/routes/levels";
import Stars from "./stars";
import enemySpaceShipModel1 from "~/assets/models/enemy_space_ship_1.glb";
import enemySpaceShipModel2 from "~/assets/models/enemy_space_ship_2.glb";
import SpaceShip from "../game/space-ship";

export default function BattlegroundScene() {
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

  const model1 = useGLTF(enemySpaceShipModel1);
  const model2 = useGLTF(enemySpaceShipModel2);

  return (
    <Physics>
      <ambientLight intensity={Math.PI / 2} />
      <Stars count={3000} outerRadius={200} innerRadius={110} />
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
        return (
          <Enemy
            key={enemy.id}
            enemy={enemy}
            scene={enemy.spaceShipModelNum === 1 ? model1.scene : model2.scene}
          />
        );
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
