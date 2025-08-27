import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface StarsProps {
  count: number;
  outerRadius: number;
  innerRadius: number;
}

function useStarPositions(
  count: number,
  outerRadius: number,
  innerRadius: number
) {
  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(
        Math.random() * (outerRadius ** 3 - innerRadius ** 3) + innerRadius ** 3
      );
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      buffer.set([x, y, z], i * 3);
    }
    return buffer;
  }, [count, outerRadius, innerRadius]);

  return positions;
}

export default function Stars({ count, outerRadius, innerRadius }: StarsProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = useStarPositions(count, outerRadius, innerRadius);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        color={"#ffffff"}
        transparent
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}
