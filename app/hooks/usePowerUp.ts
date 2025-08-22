import { useEffect, useRef } from "react";
import { KILLS_PER_POWERUP } from "~/constants";
import { addPowerUp } from "~/features/game/game-slice";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";

export default function usePowerUp() {
  const killStatus = useAppSelector((state) => state.game.killStatus);
  const dispatch = useAppDispatch();
  // a countdown for powerUp (... + 1 : we need + 1 to neutralize useEffect)
  const killsUntilPowerUpRef = useRef(KILLS_PER_POWERUP + 1);

  useEffect(() => {
    // one new killed submited
    killsUntilPowerUpRef.current--;

    if (killsUntilPowerUpRef.current === 0) {
      // reset needed kills
      killsUntilPowerUpRef.current = KILLS_PER_POWERUP;
      dispatch(addPowerUp(killStatus.lastKillPosition));
    }
  }, [killStatus.count]);
}
