import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router";
import Ring from "~/components/world/ring";
import Stars from "~/components/world/stars";
import bossModelPath from "~/assets/models/boss_fight.glb";

export function Model({
  path,
  scale,
  rotation,
}: {
  path: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={scale} rotation={rotation} />;
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
      camera={{ position: [-2, 1, 5], fov: 75, near: 0.1, far: 50 }}
      className="bg-space"
    >
      <pointLight color={"#ffffff"} intensity={150} position={[2, 2, 5]} />
      <Stars
        count={3000}
        outerRadius={30}
        innerRadius={10}
        isLevelPage={false}
      />
      <Rings />
      <Model path={bossModelPath} />
    </Canvas>
  );
}

function Home() {
  return (
    <div className="w-full h-[100dvh] relative">
      <div className="w-full h-full absolute left-0 top-0">
        <HomeScene />
      </div>
      <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center gap-8 select-none">
        <h1 className="uppercase text-white font-exo2 text-[calc(3rem_+_2vw)] text-center lg:text-[4.5rem] text-shadow-[2px_2px_15px_#ffffff]">
          elements invaders
        </h1>
        <div className="bg-[#ffffff10] transition-all w-[300px] hover:bg-transparent text-center">
          <Link
            to={"/levels"}
            className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block"
          >
            play game
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
