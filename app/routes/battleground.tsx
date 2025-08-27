import { Canvas } from "@react-three/fiber";
import BattlegroundScene from "~/components/world/battlegroundScene";

function BattleGround() {
  return (
    <div className="w-full h-[100dvh] relative cursor-none">
      <div className="absolute top-0 left-0 w-full h-full">hello there</div>
      <div className="absolute w-full h-full top-0 left-0">
        <Canvas
          camera={{
            position: [0, 0, 100],
            fov: 75,
            near: 0.1,
            far: 600,
          }}
          className="bg-space"
        >
          <BattlegroundScene />
        </Canvas>
      </div>
    </div>
  );
}

export default BattleGround;
