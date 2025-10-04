import * as THREE from "three";
import { useMemo } from "react";

export default function EnemySpaceShipModel2() {
  return (
    <group>
      <EnemySpaceShipBodySection />
      <EnemySpaceShipFrontSection />
      <EnemySpaceShipSphereSection dir={"right"} />
      <EnemySpaceShipSphereSection dir={"left"} />
      <EnemySpaceShipGlass />
      <EnemySpaceShipEngine dir={"right"} />
      <EnemySpaceShipEngine dir={"left"} />
    </group>
  );
}

function EnemySpaceShipEngine({ dir }: { dir: "left" | "right" }) {
  const isRight = dir === "right";

  return (
    <group>
      <EnemySpaceShipEngineMiddlePart isRight={isRight} />
      <EnemySpaceShipEngineSidePart side="front" isRight={isRight} />
      <EnemySpaceShipEngineSidePart side="back" isRight={isRight} />
    </group>
  );
}

function EnemySpaceShipEngineMiddlePart({ isRight }: { isRight: boolean }) {
  return (
    <>
      <mesh position={[1.55 * (isRight ? 1 : -1), 2.6, 0]}>
        <boxGeometry args={[0.75, 1.8, 3.05]} />
        <meshStandardMaterial color={"#474747"} />
      </mesh>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[2.7 * (isRight ? 1 : -1), 2.65, 0.45]}
      >
        <cylinderGeometry args={[0.1, 0.1, 1.6, 12]} />
        <meshStandardMaterial color="#b00008" />
      </mesh>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[2.7 * (isRight ? 1 : -1), 2.65, -0.45]}
      >
        <cylinderGeometry args={[0.1, 0.1, 1.6, 12]} />
        <meshStandardMaterial color="#b00008" />
      </mesh>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[2.7 * (isRight ? 1 : -1), 1.62, 0.45]}
      >
        <cylinderGeometry args={[0.1, 0.1, 1.6, 12]} />
        <meshStandardMaterial color="#b00008" />
      </mesh>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[2.7 * (isRight ? 1 : -1), 1.62, -0.45]}
      >
        <cylinderGeometry args={[0.1, 0.1, 1.6, 12]} />
        <meshStandardMaterial color="#b00008" />
      </mesh>
      <mesh position={[3.3 * (isRight ? 1 : -1), 2.22, 0]}>
        <boxGeometry args={[0.3, 2.2, 1.15]} />
        <meshStandardMaterial color={"#474747"} />
      </mesh>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[3.3 * (isRight ? 1 : -1), 1.1, 0]}
      >
        <cylinderGeometry args={[0.58, 0.58, 0.3, 30]} />
        <meshStandardMaterial color={"#474747"} />
      </mesh>
    </>
  );
}

function EnemySpaceShipEngineSidePart({
  side,
  isRight,
}: {
  side: "front" | "back";
  isRight: boolean;
}) {
  const isFront = side === "front";

  return (
    <>
      <mesh position={[2 * (isRight ? 1 : -1), 2.63, 1.3 * (isFront ? 1 : -1)]}>
        <boxGeometry args={[0.4, 0.2, 0.7]} />
        <meshStandardMaterial color="#b00008" />
      </mesh>
      <mesh
        position={[2.3 * (isRight ? 1 : -1), 2.3, 1.5 * (isFront ? 1 : -1)]}
      >
        <cylinderGeometry args={[0.2, 0.2, 2.2, 12]} />
        <meshStandardMaterial color={"#474747"} />
      </mesh>
    </>
  );
}

function EnemySpaceShipGlass() {
  return (
    <group position={[0, -1.5, 1.5]}>
      <mesh rotation={[0, 0, Math.PI / 4]} position={[-0.6, 0.1, -0.05]}>
        <boxGeometry args={[0.8, 0.8, 0.3]} />
        <meshStandardMaterial color={"#040052"} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0, -0.3, -0.05]}>
        <boxGeometry args={[0.8, 0.8, 0.3]} />
        <meshStandardMaterial color={"#040052"} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0.6, 0.1, -0.05]}>
        <boxGeometry args={[0.8, 0.8, 0.3]} />
        <meshStandardMaterial color={"#040052"} />
      </mesh>
    </group>
  );
}

function EnemySpaceShipSphereSection({ dir }: { dir: "right" | "left" }) {
  const isRight = dir === "right";

  return (
    <mesh position={[1.2 * (isRight ? 1 : -1), -2.15, 0]}>
      <sphereGeometry args={[1.35, 20, 20]} />
      <meshStandardMaterial color={"#474747"} />
    </mesh>
  );
}

function EnemySpaceShipFrontSection() {
  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      // layer 1
      1.9, -1, 1.5, -1.9, -1, 1.5, 1.9, -1, -1.5, -1.9, -1, -1.5,
      // layer 2
      0.23, -2.7, 1.5, -0.23, -2.7, 1.5, 0.23, -2.7, -1.5, -0.23, -2.7, -1.5,
    ]);
    const indices = new Uint16Array([
      0, 1, 4, 1, 5, 4, 1, 3, 5, 3, 7, 5, 3, 2, 7, 2, 6, 7, 2, 0, 6, 0, 4, 6, 4,
      5, 6, 7, 6, 5,
    ]);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#b00008" />
    </mesh>
  );
}

function EnemySpaceShipBodySection() {
  return (
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[3.8, 2.7, 3]} />
      <meshStandardMaterial color="#b00008" />
    </mesh>
  );
}
