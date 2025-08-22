import { useEffect, useRef, type RefObject } from "react";
import { addAmmo, coolingSystem } from "~/features/game/game-slice";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";

export default function usePlayerShooting(
  mousePosRef: RefObject<{ x: number; y: number }>
) {
  const { isOverheated, numberOfBlasters } = useAppSelector(
    (state) => state.game
  );
  const dispatch = useAppDispatch();
  // just a container for setInterval
  const gunfireIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const coolingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // interval lifecycle
  useEffect(() => {
    return () => {
      if (coolingIntervalRef.current) {
        clearInterval(coolingIntervalRef.current);
      }
      if (gunfireIntervalRef.current) {
        clearInterval(gunfireIntervalRef.current);
      }
    };
  }, []);

  // start cooling after overheated
  useEffect(() => {
    handlePointerUpOnSpaceShip();
  }, [isOverheated]);

  function createAmmo(
    args: [number, number, number],
    color: string,
    type: "bullet" | "blaster"
  ) {
    if (isOverheated) return;
    if (coolingIntervalRef.current) clearInterval(coolingIntervalRef.current);

    coolingIntervalRef.current = setInterval(() => {
      dispatch(coolingSystem());
    }, 500);

    dispatch(
      addAmmo({
        position: [mousePosRef.current.x, mousePosRef.current.y, 1],
        args,
        color,
        type,
      })
    );
  }

  function handlePointerDownLeftClick(
    args: [number, number, number],
    color: string
  ) {
    if (gunfireIntervalRef.current) clearInterval(gunfireIntervalRef.current);

    createAmmo(args, color, "bullet");

    gunfireIntervalRef.current = setInterval(() => {
      createAmmo(args, color, "bullet");
    }, 200);
  }

  function handlePointerDownRightClick(
    arg: [number, number, number],
    color: string
  ) {
    if (numberOfBlasters === 0) return;

    createAmmo(arg, color, "blaster");
  }

  function handlePointerUpOnSpaceShip() {
    if (gunfireIntervalRef.current) {
      clearInterval(gunfireIntervalRef.current);
    }
  }

  return {
    handlePointerDownLeftClick,
    handlePointerDownRightClick,
    handlePointerUpOnSpaceShip,
  };
}
