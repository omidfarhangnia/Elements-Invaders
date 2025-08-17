import { useRef, useState } from "react";
import type { BulletType } from "../game/bullet";
import type { EnemyType } from "../game/enemy";
import { v4 as uuidv4 } from "uuid";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import Ship, { ShipEngine, ShipHealth } from "../game/ship";
import { Surface } from "./surface";
import Bullet from "../game/bullet";
import Enemy from "../game/enemy";
import type { EnemyArrangements } from "~/routes/lobby";

type GameStatus = "playing" | "ended";

export default function Scene({
  enemyArrangements,
}: {
  enemyArrangements: EnemyArrangements[];
}) {
  const [bullets, setBullets] = useState<BulletType[]>([]);
  const [enemies, setEnemies] = useState<EnemyType[]>(
    enemyArrangements[0].enemyArrangments
  );
  const [shipHealth, setShipHealth] = useState(100); // 0 < health < 100
  const [shipEngine, setShipEngine] = useState(0); // 0 < engine < 100
  const [isShipInvisible, setIsShipInvisible] = useState(false);

  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

  const shipRef = useRef<RapierRigidBody>(null!);
  const gunfireInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const coolingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const processedBulletCollisionWithEnemyRef = useRef(new Set<string>());
  const isShipCollisionWithEnemyRef = useRef(false);

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePos.current = { x: event.point.x, y: event.point.y };
  }

  function handleCreateBullet(
    position: { x: number; y: number },
    args: [number, number, number],
    color: string
  ) {
    setShipEngine((currentEngine) => {
      if (currentEngine >= 100) {
        return currentEngine;
      }

      if (coolingInterval.current) clearInterval(coolingInterval.current);

      setBullets((bullets) => [
        ...bullets,
        {
          position: [position.x, position.y, 1],
          args,
          color,
          id: uuidv4(),
        },
      ]);

      coolingInterval.current = setInterval(() => {
        setShipEngine((x) => {
          if (x < 10) {
            if (coolingInterval.current) {
              clearInterval(coolingInterval.current);
            }
            return 0;
          } else {
            return x - 10;
          }
        });
      }, 1000);

      return currentEngine + 5;
    });
  }

  function handlePointerDownInBox(
    args: [number, number, number],
    color: string
  ) {
    if (gunfireInterval.current) clearInterval(gunfireInterval.current);

    handleCreateBullet(mousePos.current, args, color);

    gunfireInterval.current = setInterval(() => {
      handleCreateBullet(mousePos.current, args, color);
    }, 200);
  }

  function handlePointerUpInBox() {
    if (gunfireInterval.current) {
      clearInterval(gunfireInterval.current);
    }
  }

  function handleDeleteBullet(id: string) {
    setBullets((currentBullets) =>
      currentBullets.filter((bullet) => bullet.id !== id)
    );
  }

  useFrame(() => {
    if (shipRef.current) {
      shipRef.current.setNextKinematicTranslation({
        x: mousePos.current.x,
        y: mousePos.current.y,
        z: 1,
      });
    }
  });

  function handleCollisionBulletToEnemy(bulletId: string, enemyId: string) {
    if (processedBulletCollisionWithEnemyRef.current.has(bulletId)) {
      return;
    }

    processedBulletCollisionWithEnemyRef.current.add(bulletId);
    handleDeleteBullet(bulletId);

    const bulletDamage = 20;

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

  function handleMakeVisibleShip() {
    setTimeout(() => {
      setIsShipInvisible(false);
      isShipCollisionWithEnemyRef.current = false;
    }, 2000);
  }

  function handleCollisionShipToEnemy() {
    if (isShipCollisionWithEnemyRef.current || isShipInvisible) return;

    const damage = 20;

    isShipCollisionWithEnemyRef.current = true;
    setIsShipInvisible(true);

    setShipHealth((currentHealth) => {
      const newHealth = currentHealth - damage;
      if (newHealth <= 0) {
        console.log("game over");
        setGameStatus("ended");
        return 0;
      }

      return newHealth;
    });

    handleMakeVisibleShip();
  }

  return (
    <Physics debug>
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <ShipHealth shipHealth={shipHealth} />
      <ShipEngine shipEngine={shipEngine} />
      <Ship
        startTheGunfire={() => handlePointerDownInBox([1, 1, 1], "red")}
        stopTheGunefire={handlePointerUpInBox}
        ref={shipRef}
        onCollision={handleCollisionShipToEnemy}
        isShipInvisible={isShipInvisible}
      />
      <Surface moveTheShip={handlePointerMove} />
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
