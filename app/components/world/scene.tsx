import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import SpaceShip, {
  SpaceShipHealth,
  SpaceShipOverheat,
} from "../game/space-ship";
import { Surface } from "./surface";
import Bullet from "../game/bullet";
import Enemy from "../game/enemy";
import type { EnemyArrangements } from "~/routes/lobby";
import {
  BULLET_DAMAGE_LEVEL_1,
  BULLET_DAMAGE_LEVEL_2,
  BULLET_DAMAGE_LEVEL_3,
  ENEMY_SHOOT_DURATION,
  INVINCIBILITY_DURATION,
} from "~/constants";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";
import {
  addBullet,
  addEnemiseBullet,
  coolingSystem,
  damageEnemy,
  damageSpaceShip,
  initializeEnemies,
  removeBullet,
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
    enemiesBullets,
    isOverheated,
    isSpaceShipInvisible,
    bulletLevel,
    gameStatus,
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
    spaceShipBullet: new Set<string>(),
    enemyBullet: new Set<string>(),
    spaceShip: false,
  });
  const shotEnemiesRef = useRef(new Set<string>());

  // initial value for enemies
  useEffect(() => {
    dispatch(initializeEnemies(enemyArrangements[0].enemyArrangments));
  }, [dispatch, enemyArrangements]);

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

  function createBullet(
    position: { x: number; y: number },
    args: [number, number, number],
    color: string
  ) {
    if (isOverheated) return;
    if (coolingIntervalRef.current) clearInterval(coolingIntervalRef.current);

    coolingIntervalRef.current = setInterval(() => {
      dispatch(coolingSystem());
    }, 500);

    dispatch(addBullet({ position: [position.x, position.y, 1], args, color }));
  }

  function handlePointerDownOnSpaceShip(
    args: [number, number, number],
    color: string
  ) {
    if (gunfireIntervalRef.current) clearInterval(gunfireIntervalRef.current);

    createBullet(mousePosRef.current, args, color);

    gunfireIntervalRef.current = setInterval(() => {
      createBullet(mousePosRef.current, args, color);
    }, 200);
  }

  function handlePointerUpOnSpaceShip() {
    if (gunfireIntervalRef.current) {
      clearInterval(gunfireIntervalRef.current);
    }
  }

  function deleteBullet(id: string, bulletOwner: "spaceShip" | "enemy") {
    dispatch(removeBullet({ id, bulletOwner }));
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

  function calcBulletDamage() {
    switch (bulletLevel) {
      case 1:
        return BULLET_DAMAGE_LEVEL_1;
      case 2:
        return BULLET_DAMAGE_LEVEL_2;
      case 3:
        return BULLET_DAMAGE_LEVEL_3;
    }
  }

  function collisionBulletToEnemy(bulletId: string, enemyId: string) {
    // prevent duplicate collisions from being recorded
    if (collisionEventsRef.current.spaceShipBullet.has(bulletId)) {
      return;
    }
    collisionEventsRef.current.spaceShipBullet.add(bulletId);

    deleteBullet(bulletId, "spaceShip");

    const bulletDamage = calcBulletDamage();
    dispatch(damageEnemy({ enemyId, bulletDamage }));
  }

  function collisionBulletToSpaceShip(bulletId: string) {
    if (
      collisionEventsRef.current.enemyBullet.has(bulletId) ||
      isSpaceShipInvisible
    ) {
      return;
    }
    collisionEventsRef.current.enemyBullet.add(bulletId);

    const damage = 20;

    deleteBullet(bulletId, "enemy");

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

    const damage = 20;

    collisionEventsRef.current.spaceShip = true;

    // now is not visibile
    dispatch(toggleSpaceShipVisibility());
    dispatch(damageSpaceShip(damage));

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
      })
    );
  }

  return (
    <Physics debug>
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <SpaceShipHealth />
      <SpaceShipOverheat />
      <SpaceShip
        startTheGunfire={() => handlePointerDownOnSpaceShip([1, 1, 1], "red")}
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
            deleteBullet={deleteBullet}
            onCollision={collisionBulletToEnemy}
          />
        );
      })}
      {enemiesBullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            bullet={bullet}
            owner="enemy"
            deleteBullet={deleteBullet}
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
