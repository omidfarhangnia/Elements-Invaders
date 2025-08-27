import { Canvas, useFrame } from "@react-three/fiber";
import { Link } from "react-router";
import type { EnemyType } from "~/components/game/enemy";
import Stars from "~/components/world/stars";
import {
  ATTACK_WAVE_LEVEL_1,
  ATTACK_WAVE_LEVEL_2,
  ATTACK_WAVE_LEVEL_3,
} from "~/constants";
import { Model } from "./home";
import playerSpaceShip from "~/assets/models/player_space_ship.glb";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";
import { setLevel } from "~/features/game/game-slice";
import { FiLock } from "react-icons/fi";

export interface EnemyArrangements {
  levelNum: number;
  name: string;
  enemyArrangments: EnemyType[];
}

const enemyArrangements: EnemyArrangements[] = [
  {
    levelNum: 1,
    name: "level one",
    enemyArrangments: ATTACK_WAVE_LEVEL_1,
  },
  {
    levelNum: 2,
    name: "level two",
    enemyArrangments: ATTACK_WAVE_LEVEL_2,
  },
  {
    levelNum: 3,
    name: "level three",
    enemyArrangments: ATTACK_WAVE_LEVEL_3,
  },
];

function getRandomFireColor() {
  const hue = Math.floor(Math.random() * 41);
  const saturation = 100;
  const lightness = 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getRandomPointInCircle(radius: number) {
  const angle = Math.random() * 2 * Math.PI;
  const r = radius * Math.sqrt(Math.random());
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);

  return { x, z };
}

export function Flame() {
  const flameRef = useRef<THREE.Mesh>(null!);
  const { randomDelay, randomHeight, x, z, color } = useMemo(() => {
    const randomDelay = Math.random() * 10;
    const randomHeight =
      0.7 + Math.floor((Math.random() * (0.5 - 0.35)) / 0.01 + 1) * 0.01;
    const { x, z } = getRandomPointInCircle(0.07);
    const color = getRandomFireColor();

    return { randomDelay, randomHeight, x, z, color };
  }, []);

  useFrame((state) => {
    if (flameRef.current) {
      const time = state.clock.getElapsedTime();
      const yPosition = -Math.sin((time + randomDelay) * 6) * 0.04 - 0.4;
      flameRef.current.position.y = yPosition;
    }
  });

  return (
    <mesh ref={flameRef} position={[x, -0.4, z]}>
      <cylinderGeometry args={[0.01, 0.002, randomHeight, 4, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function SpaceShipFire({ flameNumber }: { flameNumber: number }) {
  return (
    <group>
      {Array.from({ length: flameNumber }).map((_, index) => (
        <Flame key={index} />
      ))}
    </group>
  );
}

function LevelScene() {
  return (
    <Canvas
      camera={{
        position: [1.5, -1, -1],
        fov: 75,
        near: 0.1,
        far: 50,
      }}
      className="bg-space"
    >
      <Stars count={3000} outerRadius={30} innerRadius={10} />
      <pointLight color={"#ffffff"} intensity={150} position={[2, 2, 5]} />
      <pointLight color={"#FF9A00"} intensity={40} position={[0.8, -2, 0]} />
      <Model path={playerSpaceShip} />
      <SpaceShipFire flameNumber={100} />
    </Canvas>
  );
}

function Levels() {
  const dispatch = useAppDispatch();
  const lastOpenedLevel = useAppSelector(
    (state) => state.game.gameLevel.lastOpenedLevel
  );

  return (
    <div className="w-full h-[100dvh] relative select-none">
      <div className="w-full h-full absolute left-0 top-0">
        <LevelScene />
      </div>
      <div className="w-full h-full absolute left-0 top-0 flex flex-col gap-[10%] items-center justify-center">
        {enemyArrangements.map((level) => {
          const isLocked = level.levelNum > lastOpenedLevel ? true : false;

          if (isLocked) {
            return (
              <div
                key={level.levelNum}
                className="bg-[#ffffff10] transition-all min-w-[200px] disabled:hover:bg-[#ffffff10] text-center w-[30%] max-w-[300px] min-h-[80px] flex items-center justify-center"
              >
                <FiLock color="#ffffff" size={30} />
              </div>
            );
          }

          return (
            <div
              onClick={() => dispatch(setLevel(level.levelNum))}
              key={level.levelNum}
              className="bg-[#ffffff10] transition-all min-w-[200px] hover:bg-transparent disabled:hover:bg-[#ffffff10] text-center w-[30%] max-w-[300px] min-h-[80px] flex items-center justify-center"
            >
              <Link
                to={"/battleground"}
                className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block w-full h-full content-center"
              >
                {level.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Levels;
