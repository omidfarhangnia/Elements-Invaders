import type { ThreeEvent } from "@react-three/fiber";
import type { Ref } from "react";
import * as THREE from "three";

type BoxProps = {
  ref: Ref<THREE.Mesh>;
  shootingTheBullet: (
    event: ThreeEvent<MouseEvent>,
    args: [number, number, number],
    color: string
  ) => void;
};

export default function Ship({ shootingTheBullet, ref }: BoxProps) {
  return (
    <mesh
      ref={ref}
      onClick={(e) => shootingTheBullet(e, [1, 1, 1], "red")}
      position={[0, 0, 1]}
      scale={1}
    >
      <boxGeometry args={[5, 5, 1]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}
