import { useThree, type ThreeEvent } from "@react-three/fiber";

type SurfaceProps = {
  moveSpaceShip: (event: ThreeEvent<PointerEvent>) => void;
};

export function Surface({ moveSpaceShip }: SurfaceProps) {
  const { viewport } = useThree();

  return (
    <mesh
      onPointerMove={moveSpaceShip}
      position={[0, 0, 0]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry />
      <meshStandardMaterial color={"#D3D3D3"} />
    </mesh>
  );
}
