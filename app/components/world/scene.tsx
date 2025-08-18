import { useEffect, useRef, useState } from "react";
import type { BulletType } from "../game/bullet";
import type { EnemyType } from "../game/enemy";
import { v4 as uuidv4 } from "uuid";
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
  COOLING_RATE,
  HEAT_PER_SHOOT,
  INVINCIBILITY_DURATION,
} from "~/constants";

type GameStatus = "playing" | "ended";

export default function Scene({
  enemyArrangements,
}: {
  enemyArrangements: EnemyArrangements[];
}) {
  /* useState */
  // all bullets are here (bullets will remove after moving out of scene)
  const [bullets, setBullets] = useState<BulletType[]>([]);
  // all enemies are here (enemies will remove after death)
  const [enemies, setEnemies] = useState<EnemyType[]>(
    enemyArrangements[0].enemyArrangments
  );
  // space ship health is in percentage 0 <= health <= 100
  const [spaceShipHealth, setSpaceShipHealth] = useState(100);
  // space ship overheat is in percentage 0 <= overheat <= 100;
  const [spaceShipOverheat, setSpaceShipOverheat] = useState(0);
  // space ship became invisible after collision with enemies
  const [isSpaceShipInvisible, setIsSpaceShipInvisible] = useState(false);
  // space ship selected bullet type
  const [bulletLevel, setBulletLevel] = useState<1 | 2 | 3>(1);
  // tracking game status (playing, ended)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

  /* useRef */
  // including the whole space ship
  const spaceShipRef = useRef<RapierRigidBody>(null!);
  // current position of mouse
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // just a container for setInterval
  const gunfireIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const coolingRef = useRef<{
    interval: ReturnType<typeof setInterval> | null;
    isOverheated: boolean;
  }>({ interval: null, isOverheated: false });
  // prevent duplicate collisions from being recorded
  const collisionEventsRef = useRef({
    bullets: new Set<string>(),
    spaceShip: false,
  });

  // interval lifecycle
  useEffect(() => {
    return () => {
      if (coolingRef.current.interval) {
        clearInterval(coolingRef.current.interval);
      }
      if (gunfireIntervalRef.current) {
        clearInterval(gunfireIntervalRef.current);
      }
    };
  }, []);

  /* functions */
  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePosRef.current = { x: event.point.x, y: event.point.y };
  }

  function handleCreateBullet(
    position: { x: number; y: number },
    args: [number, number, number],
    color: string
  ) {
    // in max heat we can't shoot until the engine cool completely
    if (coolingRef.current.isOverheated) return;

    setSpaceShipOverheat((currentHeat) => {
      if (currentHeat >= 100) {
        coolingRef.current.isOverheated = true;
        return currentHeat;
      }

      if (coolingRef.current.interval)
        clearInterval(coolingRef.current.interval);

      coolingRef.current.interval = setInterval(() => {
        setSpaceShipOverheat((x) => {
          if (x <= 50 && coolingRef.current.isOverheated) {
            coolingRef.current.isOverheated = false;
          }

          if (x < COOLING_RATE) {
            return 0;
          } else {
            return x - COOLING_RATE;
          }
        });
      }, 500);

      setBullets((bullets) => [
        ...bullets,
        {
          position: [position.x, position.y, 1],
          args,
          color,
          id: uuidv4(),
        },
      ]);

      return currentHeat + HEAT_PER_SHOOT;
    });
  }

  function handlePointerDownOnSpaceShip(
    args: [number, number, number],
    color: string
  ) {
    if (gunfireIntervalRef.current) clearInterval(gunfireIntervalRef.current);

    handleCreateBullet(mousePosRef.current, args, color);

    gunfireIntervalRef.current = setInterval(() => {
      handleCreateBullet(mousePosRef.current, args, color);
    }, 200);
  }

  function handlePointerUpOnSpaceShip() {
    if (gunfireIntervalRef.current) {
      clearInterval(gunfireIntervalRef.current);
    }
  }

  function handleDeleteBullet(id: string) {
    setBullets((currentBullets) =>
      currentBullets.filter((bullet) => bullet.id !== id)
    );
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

  function handleCollisionBulletToEnemy(bulletId: string, enemyId: string) {
    // prevent duplicate collisions from being recorded
    if (collisionEventsRef.current.bullets.has(bulletId)) {
      return;
    }
    collisionEventsRef.current.bullets.add(bulletId);

    handleDeleteBullet(bulletId);

    const bulletDamage = calcBulletDamage();

    setEnemies((currentEnemies) => {
      const enemyToUpdate = currentEnemies.find(
        (enemy) => enemy.id === enemyId
      );

      if (!enemyToUpdate) {
        return currentEnemies;
      }

      if (enemyToUpdate.health > bulletDamage) {
        return currentEnemies.map((enemy) =>
          enemy.id === enemyId
            ? { ...enemy, health: enemy.health - bulletDamage }
            : enemy
        );
      } else {
        return currentEnemies.filter((enemy) => enemy.id !== enemyId);
      }
    });
  }

  function handleMakeVisibleSpaceShip() {
    setTimeout(() => {
      setIsSpaceShipInvisible(false);
      collisionEventsRef.current.spaceShip = false;
    }, INVINCIBILITY_DURATION);
  }

  function handleCollisionSpaceShipToEnemy() {
    // prevent duplicate collisions from being recorded or calculating damage for invisible space ship
    if (collisionEventsRef.current.spaceShip || isSpaceShipInvisible) return;

    const damage = 20;

    collisionEventsRef.current.spaceShip = true;
    setIsSpaceShipInvisible(true);

    setSpaceShipHealth((currentHealth) => {
      const newHealth = currentHealth - damage;

      // game over
      if (newHealth <= 0) {
        setGameStatus("ended");
        return 0;
      }

      return newHealth;
    });

    handleMakeVisibleSpaceShip();
  }

  return (
    <Physics debug>
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <SpaceShipHealth spaceShipHealth={spaceShipHealth} />
      <SpaceShipOverheat spaceShipOverheat={spaceShipOverheat} />
      <SpaceShip
        startTheGunfire={() => handlePointerDownOnSpaceShip([1, 1, 1], "red")}
        stopTheGunfire={handlePointerUpOnSpaceShip}
        ref={spaceShipRef}
        onCollision={handleCollisionSpaceShipToEnemy}
        isSpaceShipInvisible={isSpaceShipInvisible}
      />
      <Surface moveSpaceShip={handlePointerMove} />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            bullet={bullet}
            removeOutOfRangeBullets={handleDeleteBullet}
            onCollision={handleCollisionBulletToEnemy}
          />
        );
      })}
      {enemies.map((enemy) => {
        return <Enemy key={enemy.id} enemy={enemy} />;
      })}
    </Physics>
  );
}
