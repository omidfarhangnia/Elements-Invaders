import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { EnemyType } from "~/components/game/enemy";
import Stars from "~/components/world/stars";
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

export function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function HomeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 75, near: 0.1, far: 300 }}
      className="bg-space"
    >
      <OrbitControls makeDefault />
      <directionalLight position={[10, 10, 5]} intensity={20} />
      <Stars count={3000} radius={30} />
      <Model path={"../app/assets/models/boss_fight.glb"} />
    </Canvas>
  );
}

export default function Home() {
  return (
    <div className="w-full h-[100dvh] relative">
      <div className=" absolute left-0 top-0 w-full h-full"></div>
      <div className="w-full h-full absolute left-0 top-0">
        <HomeScene />
      </div>
    </div>
  );
}
