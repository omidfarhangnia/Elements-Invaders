import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface RingProps {
  count?: number;
  radius?: number;
  height?: number;
  jitter?: number;
  rotationSpeed?: number;
  rotation?: [number, number, number];
  color: string;
}

export function useRingPositions({
  count,
  radius,
  height,
  jitter,
}: {
  count: number;
  radius: number;
  height: number;
  jitter: number;
}) {
  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * height;
      const jitteredX = x + (Math.random() - 0.5) * jitter;
      const jitteredY = y + (Math.random() - 0.5) * jitter;
      const jitteredZ = z + (Math.random() - 0.5) * jitter;
      buffer.set([jitteredX, jitteredY, jitteredZ], i * 3);
    }
    return buffer;
  }, [count, radius, height, jitter]);

  return positions;
}

export default function Ring({
  count = 2000,
  radius = 2.1,
  height = 0.2,
  jitter = 0.02,
  rotationSpeed = 0.01,
  rotation = [0, 0, Math.PI / 6],
  color,
}: RingProps) {
  const ringRef = useRef<THREE.Points>(null!);
  const positions = useRingPositions({ count, radius, height, jitter });

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Points ref={ringRef} positions={positions} rotation={rotation}>
      <PointMaterial
        color={color}
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}
