import { useRef, useState } from "react";
import type { BulletType } from "../game/bullet";
import type { EnemyType } from "../game/enemy";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import Ship from "../game/ship";
import { Surface } from "./surface";
import Bullet from "../game/bullet";
import Enemy from "../game/enemy";
import type { EnemyArrangements } from "~/routes/lobby";

export default function Scene({
  enemyArrangements,
}: {
  enemyArrangements: EnemyArrangements[];
}) {
  const [bullets, setBullets] = useState<BulletType[]>([]);
  const [enemies, setEnemies] = useState<EnemyType[]>(
    enemyArrangements[0].enemyArrangments
  );

  const boxRef = useRef<THREE.Mesh>(null!);
  const mousePos = useRef({ x: 0, y: 0 });

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePos.current = { x: event.point.x, y: event.point.y };
  }

  function handleClickBox(
    event: ThreeEvent<MouseEvent>,
    args: [number, number, number],
    color: string
  ) {
    setBullets((bullets) => [
      ...bullets,
      {
        position: [event.point.x, event.point.y, 1],
        args,
        color,
        id: uuidv4(),
      },
    ]);
  }

  function handleDeleteBullet(id: string) {
    setBullets((currentBullets) =>
      currentBullets.filter((bullet) => bullet.id !== id)
    );
  }

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.position.x = mousePos.current.x;
      boxRef.current.position.y = mousePos.current.y;
    }
  });

  function handleCollision(bulletId: string, enemyId: string) {
    if (!bullets.find((member) => member.id === bulletId)) return;
  }

  return (
    <Physics>
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <Ship ref={boxRef} shootingTheBullet={handleClickBox} />
      <Surface moveTheShip={handlePointerMove} />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            bullet={bullet}
            removeOutOfRangeBullets={handleDeleteBullet}
            onCollision={handleCollision}
          />
        );
      })}
      {enemies.map((enemy) => {
        return <Enemy key={enemy.id} enemy={enemy} />;
      })}
    </Physics>
  );
}
