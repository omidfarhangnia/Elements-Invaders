import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { useRef, type RefObject } from "react";

export default function useSpaceShipControls(
  spaceShipRef: RefObject<RapierRigidBody>
) {
  // current position of mouse
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    mousePosRef.current = { x: event.point.x, y: event.point.y };
  }

  useFrame(() => {
    if (spaceShipRef.current) {
      spaceShipRef.current.setNextKinematicTranslation({
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
        z: 1,
      });
    }
  });

  return { handlePointerMove, mousePosRef };
}
