import * as THREE from "three";
import { Edges } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function BossFightSpaceShip() {
  const modelRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    modelRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={modelRef} position={[0, -60, 0]}>
      <BossFightSpaceShipBodySection />
      <BossFightSpaceShipGlass side={"front"} />
      <BossFightSpaceShipGlass side={"back"} />
      <BossFightSpaceShipBottomDetail />
      <BossFightSpaceShipLayer1Detail side={"right"} />
      <BossFightSpaceShipLayer1Detail side={"left"} />
      <BossFightSpaceShipLayer2SideDetail side={"right"} />
      <BossFightSpaceShipLayer2SideDetail side={"left"} />
      <BossFightSpaceShipLayer3SideDetall side={"front"} />
      <BossFightSpaceShipLayer3SideDetall side={"back"} />
    </group>
  );
}

function BossFightSpaceShipLayer3SideDetall({
  side,
}: {
  side: "front" | "back";
}) {
  const isFront = side === "front";

  return (
    <>
      <SmallAntenna
        position={[4.7, 55.2, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[-4.7, 55.2, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[13.9, 55.2, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[-13.9, 55.2, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[4.7, 64.9, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[-4.7, 64.9, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[13.9, 64.9, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <SmallAntenna
        position={[-13.9, 64.9, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <CurveAntenna
        position={[4.7, 47, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <CurveAntenna
        position={[-4.7, 47, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), Math.PI, 0]}
      />
      <CurveAntenna
        position={[4.7, 73.1, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), 0, 0]}
      />
      <CurveAntenna
        position={[-4.7, 73.1, 43.5 * (isFront ? 1 : -1)]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[(Math.PI / 2) * (isFront ? -1 : 1), Math.PI, 0]}
      />
    </>
  );
}

function BossFightSpaceShipLayer2SideDetail({
  side,
}: {
  side: "right" | "left";
}) {
  const isRight = side === "right";

  return (
    <>
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 46, 5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 46, -5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 55, 5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 55, -5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 65, 5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 65, -5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 74.2, 5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <SmallAntenna
        position={[43.5 * (isRight ? 1 : -1), 74.2, -5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <BigAntenna
        position={[41 * (isRight ? 1 : -1), 41, 0]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 2) * (isRight ? 1 : -1)]}
      />
      <CurveAntenna
        position={[43.5 * (isRight ? 1 : -1), 65, 13.8]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[
          Math.PI * (isRight ? 0 : 1),
          0,
          (Math.PI / 2) * (isRight ? 1 : -1),
        ]}
      />
      <CurveAntenna
        position={[43.5 * (isRight ? 1 : -1), 55, 13.8]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[
          Math.PI * (isRight ? 1 : 0),
          0,
          (Math.PI / 2) * (isRight ? 1 : -1),
        ]}
      />
      <CurveAntenna
        position={[43.5 * (isRight ? 1 : -1), 65, -13.8]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[
          Math.PI * (isRight ? 0 : 1),
          0,
          (Math.PI / 2) * (isRight ? 1 : -1),
        ]}
      />
      <CurveAntenna
        position={[43.5 * (isRight ? 1 : -1), 55, -13.8]}
        color={"#474747"}
        curveDir={"right"}
        rotation={[
          Math.PI * (isRight ? 1 : 0),
          0,
          (Math.PI / 2) * (isRight ? 1 : -1),
        ]}
      />
    </>
  );
}

function BossFightSpaceShipLayer1Detail({ side }: { side: "right" | "left" }) {
  const isRight = side === "right";

  return (
    <>
      <SmallAntenna
        position={[27.8 * (isRight ? 1 : -1), 26, 5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={8}
      />
      <SmallAntenna
        position={[27.8 * (isRight ? 1 : -1), 26, -5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={8}
      />
      <SmallAntenna
        position={[34 * (isRight ? 1 : -1), 32, 5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={8}
      />
      <SmallAntenna
        position={[34 * (isRight ? 1 : -1), 32, -5.2]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={8}
      />
      <BigAntenna
        position={[27.8 * (isRight ? 1 : -1), 26, 13.3]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={11}
      />
      <BigAntenna
        position={[27.8 * (isRight ? 1 : -1), 26, -13.3]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={11}
      />
      <BigAntenna
        position={[34 * (isRight ? 1 : -1), 32, 13.3]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={11}
      />
      <BigAntenna
        position={[34 * (isRight ? 1 : -1), 32, -13.3]}
        color={"#474747"}
        rotation={[0, 0, (Math.PI / 4) * (isRight ? 1 : -1)]}
        length={11}
      />
    </>
  );
}

function BossFightSpaceShipBottomDetail() {
  return (
    <>
      <SmallAntenna position={[4.7, 16.2, 5.2]} color={"#474747"} />
      <SmallAntenna position={[-4.7, 16.2, 5.2]} color={"#474747"} />
      <SmallAntenna position={[4.7, 16.2, -5.2]} color={"#474747"} />
      <SmallAntenna position={[-4.7, 16.2, -5.2]} color={"#474747"} />
      <SmallAntenna position={[14, 16.8, 5.2]} color={"#474747"} />
      <SmallAntenna position={[-14, 16.8, 5.2]} color={"#474747"} />
      <SmallAntenna position={[14, 16.8, -5.2]} color={"#474747"} />
      <SmallAntenna position={[-14, 16.8, -5.2]} color={"#474747"} />
      <BigAntenna position={[19, 19, 0]} color={"#474747"} />
      <BigAntenna position={[-19, 19, 0]} color={"#474747"} />
      <CurveAntenna
        position={[4.9, 16.2, 13.7]}
        color={"#474747"}
        curveDir={"right"}
      />
      <CurveAntenna
        position={[-4.9, 16.2, 13.7]}
        color={"#474747"}
        curveDir={"left"}
      />
      <CurveAntenna
        position={[4.9, 16.2, -13.7]}
        color={"#474747"}
        curveDir={"right"}
      />
      <CurveAntenna
        position={[-4.9, 16.2, -13.7]}
        color={"#474747"}
        curveDir={"left"}
      />
    </>
  );
}

function CurveAntenna({
  position,
  color,
  curveDir,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  color: string;
  curveDir: "right" | "left";
  rotation?: [number, number, number];
}) {
  const isRight = curveDir === "right";
  return (
    <>
      <group position={position} rotation={rotation}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.7, 5.3, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          position={[0.89 * (isRight ? -1 : 1), -4, 0]}
          rotation={[0, 0, (Math.PI / 180) * 30 * (isRight ? -1 : 1)]}
        >
          <cylinderGeometry args={[0.7, 0.4, 4, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          rotation={[0, 0, (Math.PI / 180) * 30 * (isRight ? 1 : -1)]}
          position={[2.5 * (isRight ? -1 : 1), -4.7, 0]}
        >
          <cylinderGeometry args={[0.2, 0.4, 3, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </>
  );
}

function SmallAntenna({
  position,
  color,
  rotation = [0, 0, 0],
  length = 5.3,
}: {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  length?: number;
}) {
  return (
    <>
      <group position={position} rotation={rotation}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, length, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -length / 2, 0]}>
          <sphereGeometry args={[0.5, 30]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </>
  );
}

function BigAntenna({
  position,
  color,
  rotation = [0, 0, 0],
  length = 5.5,
}: {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  length?: number;
}) {
  return (
    <>
      <group position={position} rotation={rotation}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, length, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -length / 2, 0]}>
          <sphereGeometry args={[0.8, 30]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </>
  );
}

function BossFightSpaceShipGlass({ side }: { side: "front" | "back" }) {
  const isFront = side === "front";

  return (
    <group>
      <mesh
        position={[0, 32, 31 * (isFront ? 1 : -1)]}
        rotation={[(Math.PI / 180) * 13 * (isFront ? 1 : -1), 0, 0]}
      >
        <icosahedronGeometry args={[8, 1]} />
        <meshStandardMaterial color={"#474747"} />
        <Edges lineWidth={1} color={"#b00008"} />
      </mesh>
    </group>
  );
}

function BossFightSpaceShipBodySection() {
  const { geometry } = useMemo(() => {
    const vertices = new Float32Array([
      // layer 1
      17.2, 18.5, 15.5, 15.5, 18.5, 17.2, -15.5, 18.5, 17.2, -17.2, 18.5, 15.5,
      17.2, 18.5, -15.5, 15.5, 18.5, -17.2, -15.5, 18.5, -17.2, -17.2, 18.5,
      -15.5,
      // layer 2
      15.5, 43, 41.5, 17.4, 45, 41.5, -15.5, 43, 41.5, -17.4, 45, 41.5, 41.5,
      43, 15.5, 41.5, 45, 17.4, -41.5, 43, 15.5, -41.5, 45, 17.4, 41.5, 43,
      -15.5, 41.5, 45, -17.4, -41.5, 43, -15.5, -41.5, 45, -17.4, 15.5, 43,
      -41.5, 17.4, 45, -41.5, -15.5, 43, -41.5, -17.4, 45, -41.5,
      // layer 3
      17, 76, 41.5, -17, 76, 41.5, 41.5, 76, 17, -41.5, 76, 17, 41.5, 76, -17,
      -41.5, 76, -17, 17, 76, -41.5, -17, 76, -41.5,
    ]);

    const indices = new Uint16Array([
      0, 1, 4, 5, 4, 1, 1, 2, 5, 5, 2, 6, 2, 3, 6, 3, 7, 6, 12, 1, 0, 12, 8, 1,
      8, 10, 1, 10, 2, 1, 10, 3, 2, 10, 14, 3, 14, 18, 3, 18, 7, 3, 18, 6, 7,
      18, 22, 6, 22, 5, 6, 22, 20, 5, 20, 4, 5, 20, 16, 4, 16, 12, 4, 12, 0, 4,
      9, 11, 8, 11, 10, 8, 11, 15, 10, 15, 14, 10, 15, 19, 14, 19, 18, 14, 19,
      23, 18, 23, 22, 18, 23, 21, 22, 21, 20, 22, 21, 17, 20, 17, 16, 20, 17,
      13, 16, 13, 12, 16, 13, 9, 12, 9, 8, 12, 24, 11, 9, 24, 25, 11, 25, 27,
      11, 27, 15, 11, 27, 29, 15, 29, 19, 15, 29, 31, 19, 31, 23, 19, 31, 30,
      23, 30, 21, 23, 30, 28, 21, 28, 17, 21, 28, 26, 17, 26, 13, 17, 26, 24,
      13, 24, 9, 13, 26, 25, 24, 26, 27, 25, 26, 29, 27, 26, 28, 29, 28, 30, 29,
      29, 30, 31,
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
        <meshStandardMaterial color={"#b00008"} />
        <Edges lineWidth={3} color={"#474747"} />
      </mesh>
    </>
  );
}
