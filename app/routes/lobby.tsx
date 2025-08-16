import { Canvas } from "@react-three/fiber";
import type { EnemyType } from "~/components/game/enemy";
import Scene from "~/components/world/scene";
import { v4 as uuidv4 } from "uuid";

export interface EnemyArrangements {
  level: 1 | 2 | 3;
  name: string;
  enemyArrangments: EnemyType[];
}

const enemyArrangements: EnemyArrangements[] = [
  {
    level: 1,
    name: "level one",
    enemyArrangments: [
      {
        position: [-20, 40, 1],
        args: [3, 3, 3],
        color: "yellow",
        id: uuidv4(),
        health: 100,
      },
      {
        position: [-10, 40, 1],
        args: [3, 3, 3],
        color: "yellow",
        id: uuidv4(),
        health: 100,
      },
      {
        position: [0, 40, 1],
        args: [3, 3, 3],
        color: "yellow",
        id: uuidv4(),
        health: 100,
      },
      {
        position: [10, 40, 1],
        args: [3, 3, 3],
        color: "yellow",
        id: uuidv4(),
        health: 100,
      },
      {
        position: [20, 40, 1],
        args: [3, 3, 3],
        color: "yellow",
        id: uuidv4(),
        health: 100,
      },
    ],
  },
];

export default function Lobby() {
  return (
    <div className="w-full h-[100vh]">
      <Canvas
        camera={{
          position: [0, 0, 100],
          fov: 75,
          near: 0.1,
          // far: 110,
          far: 300,
        }}
      >
        <Scene enemyArrangements={enemyArrangements} />
      </Canvas>
    </div>
  );
}
