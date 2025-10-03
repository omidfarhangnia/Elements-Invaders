import * as THREE from "three";
import { useMemo } from "react";

export default function EnemySpaceShipModel1() {
  return (
    <group>
      <EnemySpaceShipBodySection />
      <EnemySpaceShipFrontSection />
      <EnemySpaceShipSideSection dir={"right"} />
      <EnemySpaceShipSideSection dir={"left"} />
      <EnemySpaceShipGlass />
      <EnemySpaceShipEngine dir={"right"} />
      <EnemySpaceShipEngine dir={"left"} />
    </group>
  );
}

function EnemySpaceShipBodySection() {
  return (
    <mesh position={[0, 0.8, 0]}>
      <boxGeometry args={[2, 4, 1]} />
      <meshStandardMaterial color="#b00008" />
    </mesh>
  );
}

function EnemySpaceShipEngine({ dir }: { dir: "right" | "left" }) {
  const isRight = dir === "right";
  const dirNum = isRight ? 1 : -1;

  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      // layer 1
      1 * dirNum,
      2,
      0.4,
      1 * dirNum,
      2,
      -0.4,
      // layer 2
      1 * dirNum,
      2.2,
      0.4,
      1 * dirNum,
      2.2,
      -0.4,
      1.65 * dirNum,
      2.2,
      0.4,
      1.65 * dirNum,
      2.2,
      -0.4,
      // layer 3
      1 * dirNum,
      2.4,
      0.4,
      1 * dirNum,
      2.4,
      -0.4,
      1.8 * dirNum,
      2.4,
      0.4,
      1.8 * dirNum,
      2.4,
      -0.4,
      // layer 4
      1 * dirNum,
      2.8,
      0.4,
      1 * dirNum,
      2.8,
      -0.4,
      2 * dirNum,
      2.8,
      0.4,
      2 * dirNum,
      2.8,
      -0.4,
      // layer 5
      1 * dirNum,
      3.5,
      0.4,
      1 * dirNum,
      3.5,
      -0.4,
      2.05 * dirNum,
      3.5,
      0.4,
      2.05 * dirNum,
      3.5,
      -0.4,
    ]);

    const indices = new Uint16Array([
      0, 2, 4, 0, 4, 5, 5, 1, 0, 5, 3, 1, 6, 4, 2, 6, 8, 4, 8, 9, 4, 9, 5, 4, 3,
      2, 1, 2, 0, 1, 9, 7, 5, 7, 3, 5, 7, 6, 2, 7, 2, 3, 11, 7, 13, 13, 7, 9,
      13, 9, 8, 12, 13, 8, 12, 8, 10, 10, 8, 6, 10, 6, 11, 11, 6, 7, 14, 12, 10,
      14, 16, 12, 16, 17, 12, 17, 13, 12, 17, 15, 13, 15, 11, 13, 15, 14, 11,
      14, 10, 11, 17, 16, 15, 15, 16, 14,
    ]);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, [dirNum]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={"#474747"}
        side={isRight ? THREE.BackSide : THREE.FrontSide}
      />
    </mesh>
  );
}

function EnemySpaceShipGlass() {
  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      // layer 1
      0.25, 0.7, 0.5, 0, 0.7, 0.5, -0.25, 0.7, 0.5, 0.25, 0.68, 0.8, 0, 0.68,
      0.8, -0.25, 0.68, 0.8,
      // layer 2
      0.45, 0.4, 0.5, -0.45, 0.4, 0.5, 0.4, 0.4, 0.9, 0, 0.4, 0.9, -0.4, 0.4,
      0.9,
      // layer 3
      0.45, -0.3, 0.5, -0.45, -0.3, 0.5, 0.4, -0.3, 0.9, 0, -0.3, 0.95, -0.4,
      -0.3, 0.9,
      // layer 4
      0.35, -1, 0.5, -0.35, -1, 0.5, 0.3, -1, 0.9, 0, -1, 0.9, -0.3, -1, 0.9,
      // layer 5
      0.1, -1.3, 0.5, -0.1, -1.3, 0.5, 0.1, -1.25, 0.8, -0.1, -1.25, 0.8,
    ]);

    const indices = new Uint16Array([
      0, 1, 3, 1, 4, 3, 1, 2, 4, 2, 5, 4, 0, 3, 6, 3, 8, 6, 3, 9, 8, 3, 4, 9, 4,
      5, 9, 5, 10, 9, 5, 2, 10, 2, 7, 10, 6, 8, 11, 8, 13, 11, 8, 9, 13, 9, 14,
      13, 9, 10, 14, 10, 15, 14, 10, 7, 15, 7, 12, 15, 11, 13, 16, 13, 18, 16,
      13, 14, 18, 14, 19, 18, 14, 15, 19, 15, 20, 19, 15, 12, 20, 12, 17, 20,
      16, 18, 21, 18, 23, 21, 18, 19, 23, 19, 24, 23, 19, 20, 24, 20, 17, 24,
      17, 22, 24, 23, 22, 21, 23, 24, 22,
    ]);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, []);
  return (
    <>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={"#040052"} />
      </mesh>
    </>
  );
}

function EnemySpaceShipSideSection({ dir }: { dir: "left" | "right" }) {
  const isRight = dir === "right";

  return (
    <group>
      <mesh
        position={[1.7 * (isRight ? 1 : -1), 0.2, 0]}
        rotation={[0, 0, (Math.PI / 2.85) * (isRight ? 1 : -1)]}
      >
        <cylinderGeometry args={[0.2, 0.2, 2.1, 8]} />
        <meshStandardMaterial color={"#474747"} />
      </mesh>
      <mesh position={[2.8 * (isRight ? 1 : -1), -1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2.7, 8]} />
        <meshStandardMaterial color={"#b00008"} />
      </mesh>
      <mesh position={[2.8 * (isRight ? 1 : -1), -2.5, 0]}>
        <icosahedronGeometry args={[0.35, 12]} />
        <meshStandardMaterial color={"#b00008"} />
      </mesh>
    </group>
  );
}

function EnemySpaceShipFrontSection() {
  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      //  layer 1
      1.0, -1.2, 0.5, 0.0, -1.2, 0.5, -1.0, -1.2, 0.5, 1.0, -1.2, -0.5, 0.0,
      -1.2, -0.5, -1.0, -1.2, -0.5,
      // layer 2
      0.9, -1.8, 0.4, 0.0, -1.8, 0.4, -0.9, -1.8, 0.4, 0.9, -1.8, -0.4, 0.0,
      -1.8, -0.4, -0.9, -1.8, -0.4,
      // layer 3
      0.8, -2.4, 0.3, 0.0, -2.4, 0.3, -0.8, -2.4, 0.3, 0.8, -2.4, -0.3, 0.0,
      -2.4, -0.3, -0.8, -2.4, -0.3,
      // layer 4
      0.6, -3.0, 0.2, 0.0, -3.0, 0.2, -0.6, -3.0, 0.2, 0.6, -3.0, -0.2, 0.0,
      -3.0, -0.2, -0.6, -3.0, -0.2,
      // layer 5
      0.3, -3.4, 0.05, 0.0, -3.5, 0.05, -0.3, -3.4, 0.05, 0.3, -3.4, -0.05, 0.0,
      -3.5, -0.05, -0.3, -3.4, -0.05,
    ]);

    const indices = new Uint16Array([
      0, 6, 3, 3, 6, 9, 7, 6, 0, 0, 1, 7, 7, 1, 2, 7, 2, 8, 2, 5, 8, 5, 11, 8,
      5, 4, 11, 4, 10, 11, 3, 10, 4, 3, 9, 10, 9, 6, 12, 9, 12, 15, 6, 7, 12, 7,
      13, 12, 7, 8, 13, 8, 14, 13, 8, 11, 14, 14, 11, 17, 11, 16, 17, 11, 10,
      16, 10, 9, 16, 9, 15, 16, 15, 12, 21, 18, 21, 12, 12, 13, 18, 13, 19, 18,
      14, 19, 13, 14, 20, 19, 17, 20, 14, 20, 17, 23, 17, 16, 23, 16, 22, 23,
      16, 15, 22, 15, 21, 22, 20, 23, 26, 23, 29, 26, 23, 22, 29, 22, 28, 29,
      22, 27, 28, 22, 21, 27, 21, 18, 27, 18, 24, 27, 18, 19, 24, 19, 25, 24,
      19, 26, 25, 19, 20, 26, 24, 25, 27, 25, 28, 27, 25, 26, 28, 26, 29, 28,
    ]);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();

    return { geometry: geom };
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={"#b00008"} />
    </mesh>
  );
}
