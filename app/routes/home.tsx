import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { EnemyType } from "~/components/game/enemy";
import Ring from "~/components/world/ring";
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

function Rings() {
  return (
    <>
      <Ring color="#3f091a" />
      <Ring
        radius={2.5}
        height={0.3}
        rotation={[0, 0, -Math.PI / 4]}
        color="#390c16"
      />
      <Ring radius={2.9} color="#33051f" />
    </>
  );
}

function HomeScene() {
  return (
    <Canvas
      camera={{ position: [-2, 1, 5], fov: 75, near: 0.1, far: 300 }}
      className="bg-space"
    >
      <pointLight color={"#ffffff"} intensity={150} position={[2, 2, 5]} />
      <Stars count={3000} radius={30} />
      <Rings />
      <Model path={"../app/assets/models/boss_fight.glb"} />
    </Canvas>
  );
}

export default function Home() {
  return (
    <div className="w-full h-[100dvh] relative">
      <div className="w-full h-full absolute left-0 top-0">
        <HomeScene />
      </div>
      <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center gap-8 select-none">
        <h1 className="uppercase text-white font-exo2 text-[calc(3rem_+_2vw)] text-center lg:text-[4.5rem] text-shadow-[2px_2px_15px_#ffffff]">
          elements invaders
        </h1>
        <div className="border-b-2 border-[#ffffff4e] hover:border-transparent transition-all">
          <button className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white">
            play game
          </button>
        </div>
      </div>
    </div>
  );
}
