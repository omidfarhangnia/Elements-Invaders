import { useThree, type ThreeEvent } from "@react-three/fiber";

type SurfaceProps = {
  moveTheShip: (event: ThreeEvent<PointerEvent>) => void;
};

export function Surface({ moveTheShip }: SurfaceProps) {
  const { viewport } = useThree();

  return (
    <mesh
      onPointerMove={moveTheShip}
      position={[0, 0, 0]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry />
      <meshStandardMaterial color={"#D3D3D3"} />
    </mesh>
  );
}
