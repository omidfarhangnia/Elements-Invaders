import { Canvas } from "@react-three/fiber";
import type { EnemyType } from "~/components/game/enemy";
import Scene from "~/components/world/scene";
import {
  ATTACK_WAVE_LEVEL_1,
  ATTACK_WAVE_LEVEL_2,
  ATTACK_WAVE_LEVEL_3,
} from "~/constants";

export interface EnemyArrangements {
  level: 1 | 2 | 3;
  name: string;
  enemyArrangments: EnemyType[];
}

const enemyArrangements: EnemyArrangements[] = [
  {
    level: 1,
    name: "level one",
    enemyArrangments: ATTACK_WAVE_LEVEL_1,
  },
  {
    level: 2,
    name: "level two",
    enemyArrangments: ATTACK_WAVE_LEVEL_2,
  },
  {
    level: 3,
    name: "level three",
    enemyArrangments: ATTACK_WAVE_LEVEL_3,
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
