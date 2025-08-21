import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import SpaceShip, {
  SpaceShipAmmo,
  SpaceShipHealth,
  SpaceShipOverheat,
} from "../game/space-ship";
import { Surface } from "./surface";
import Bullet, { Blaster } from "../game/bullet";
import Enemy from "../game/enemy";
import type { EnemyArrangements } from "~/routes/lobby";
import {
  BLASTER_DAMAGE,
  BULLET_DAMAGE_LEVEL_1,
  BULLET_DAMAGE_LEVEL_2,
  BULLET_DAMAGE_LEVEL_3,
  ENEMY_COLLISION_DAMAGE,
  ENEMY_SHOOT_DURATION,
  INVINCIBILITY_DURATION,
} from "~/constants";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";
import {
  addAmmo,
  addEnemiseBullet,
  coolingSystem,
  damageEnemy,
  damageSpaceShip,
  initializeEnemies,
  removeAmmo,
  toggleSpaceShipVisibility,
} from "~/features/game/game-slice";

export default function Scene({
  enemyArrangements,
}: {
  enemyArrangements: EnemyArrangements[];
}) {
  const {
    enemies,
    bullets,
    blasters,
    numberOfBlasters,
    enemiesBullets,
    isOverheated,
    isSpaceShipInvisible,
    bulletLevel,
    gameStatus,
    gameLevel,
  } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  /* useRef */
  // including the whole space ship
  const spaceShipRef = useRef<RapierRigidBody>(null!);
  // current position of mouse
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // just a container for setInterval
  const gunfireIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const coolingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const enemyBulletIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  // prevent duplicate collisions from being recorded
  const collisionEventsRef = useRef({
    spaceShipAmmo: new Set<string>(),
    enemyAmmo: new Set<string>(),
    spaceShip: false,
  });
  const shotEnemiesRef = useRef(new Set<string>());

  // initial value for enemies
  useEffect(() => {
    dispatch(
      initializeEnemies(
        enemyArrangements[gameLevel.selectedLevel - 1].enemyArrangments
      )
    );
  }, [dispatch, gameLevel.selectedLevel]);

  // interval lifecycle
  useEffect(() => {
    return () => {
      if (coolingIntervalRef.current) {
        clearInterval(coolingIntervalRef.current);
      }
      if (gunfireIntervalRef.current) {
        clearInterval(gunfireIntervalRef.current);
      }
      if (enemyBulletIntervalRef.current) {
        clearInterval(enemyBulletIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    handlePointerUpOnSpaceShip();
  }, [isOverheated]);

  useEffect(() => {
    if (gameStatus === "playing") {
      enemyBulletIntervalRef.current = setInterval(
        () => enemyShoot([1.5, 1.5, 1.5], "green"),
        ENEMY_SHOOT_DURATION
      );
    }

    return () => {
      if (enemyBulletIntervalRef.current) {
        clearInterval(enemyBulletIntervalRef.current);
      }
    };
  }, [gameStatus, enemies.length]);

  /* functions */
  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePosRef.current = { x: event.point.x, y: event.point.y };
  }

  function createAmmo(
    args: [number, number, number],
    color: string,
    type: "bullet" | "blaster"
  ) {
    if (isOverheated) return;
    if (coolingIntervalRef.current) clearInterval(coolingIntervalRef.current);

    coolingIntervalRef.current = setInterval(() => {
      dispatch(coolingSystem());
    }, 500);

    dispatch(
      addAmmo({
        position: [mousePosRef.current.x, mousePosRef.current.y, 1],
        args,
        color,
        type,
      })
    );
  }

  function handlePointerDownLeftClick(
    args: [number, number, number],
    color: string
  ) {
    if (gunfireIntervalRef.current) clearInterval(gunfireIntervalRef.current);

    createAmmo(args, color, "bullet");

    gunfireIntervalRef.current = setInterval(() => {
      createAmmo(args, color, "bullet");
    }, 200);
  }

  function handlePointerUpOnSpaceShip() {
    if (gunfireIntervalRef.current) {
      clearInterval(gunfireIntervalRef.current);
    }
  }

  function deleteAmmo(
    id: string,
    ammoType: "spaceShipBullet" | "enemyBullet" | "spaceShipBlaster"
  ) {
    dispatch(removeAmmo({ id, ammoType }));
  }

  useFrame(() => {
    if (spaceShipRef.current) {
      spaceShipRef.current.setNextKinematicTranslation({
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
        z: 1,
      });
    }
  });

  function calcAmmoDamage(ammoType: "spaceShipBullet" | "spaceShipBlaster") {
    if (ammoType === "spaceShipBullet") {
      switch (bulletLevel) {
        case 1:
          return BULLET_DAMAGE_LEVEL_1;
        case 2:
          return BULLET_DAMAGE_LEVEL_2;
        case 3:
          return BULLET_DAMAGE_LEVEL_3;
      }
    } else {
      return BLASTER_DAMAGE;
    }
  }

  function collisionAmmoToEnemy(
    bulletId: string,
    enemyId?: string,
    ammoType?: "spaceShipBullet" | "spaceShipBlaster"
  ) {
    if (enemyId === undefined || ammoType === undefined) return;
    // prevent duplicate collisions from being recorded
    if (collisionEventsRef.current.spaceShipAmmo.has(bulletId)) {
      return;
    }
    collisionEventsRef.current.spaceShipAmmo.add(bulletId);

    deleteAmmo(bulletId, ammoType);

    const bulletDamage = calcAmmoDamage(ammoType);
    dispatch(damageEnemy({ enemyId, bulletDamage }));
  }

  function collisionBulletToSpaceShip(bulletId: string) {
    if (
      collisionEventsRef.current.enemyAmmo.has(bulletId) ||
      isSpaceShipInvisible
    ) {
      return;
    }
    collisionEventsRef.current.enemyAmmo.add(bulletId);

    const damage = 20;

    deleteAmmo(bulletId, "enemyBullet");

    // now is not visibile
    dispatch(toggleSpaceShipVisibility());
    dispatch(damageSpaceShip(damage));

    makeVisibleSpaceShip();
  }

  function makeVisibleSpaceShip() {
    setTimeout(() => {
      // now is visible
      dispatch(toggleSpaceShipVisibility());
      collisionEventsRef.current.spaceShip = false;
    }, INVINCIBILITY_DURATION);
  }

  function collisionSpaceShipToEnemy() {
    // prevent duplicate collisions from being recorded or calculating damage for invisible space ship
    if (collisionEventsRef.current.spaceShip || isSpaceShipInvisible) return;

    collisionEventsRef.current.spaceShip = true;

    // now is not visibile
    dispatch(toggleSpaceShipVisibility());
    dispatch(damageSpaceShip(ENEMY_COLLISION_DAMAGE));

    makeVisibleSpaceShip();
  }

  function enemyShoot(args: [number, number, number], color: string) {
    let eligibleEnemies = enemies.filter(
      (enemy) => !shotEnemiesRef.current.has(enemy.id)
    );

    if (eligibleEnemies.length === 0) {
      shotEnemiesRef.current.clear();
      eligibleEnemies = enemies;
    }

    const randomIndex = Math.floor(Math.random() * eligibleEnemies.length);
    const shootingEnemy = eligibleEnemies[randomIndex];

    if (!shootingEnemy) return;

    shotEnemiesRef.current.add(shootingEnemy.id);

    dispatch(
      addEnemiseBullet({
        position: [shootingEnemy.position[0], shootingEnemy.position[1] - 2, 1],
        args,
        color,
        type: "bullet",
      })
    );
  }

  function handlePointerDownRightClick(
    arg: [number, number, number],
    color: string
  ) {
    if (numberOfBlasters === 0) return;

    createAmmo(arg, color, "blaster");
  }

  return (
    <Physics debug>
      <OrbitControls makeDefault />
      <ambientLight intensity={Math.PI / 2} />
      <SpaceShipHealth />
      <SpaceShipOverheat />
      <SpaceShipAmmo />
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
          />
        );
      })}
      {enemies.map((enemy) => {
        return <Enemy key={enemy.id} enemy={enemy} />;
      })}
    </Physics>
  );
}
