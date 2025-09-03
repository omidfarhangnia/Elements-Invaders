import { useEffect, useRef } from "react";
import {
  BOSS_FIGHT_LEVEL,
  KILLS_PER_POWERUP,
  BULLETS_PER_POWERUP,
} from "~/constants";
import { addPowerUp } from "~/features/game/game-slice";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";

export default function usePowerUp() {
  const { combatReport, enemies, gameLevel } = useAppSelector(
    (state) => state.game
  );
  const dispatch = useAppDispatch();
  const killsUntilPowerUpRef = useRef(KILLS_PER_POWERUP + 1);
  const hitsUntilPowerUpRef = useRef(BULLETS_PER_POWERUP + 1);

  useEffect(() => {
    killsUntilPowerUpRef.current = KILLS_PER_POWERUP + 1;
    hitsUntilPowerUpRef.current = BULLETS_PER_POWERUP + 1;
  }, [gameLevel.selectedLevel]);

  useEffect(() => {
    if (gameLevel.selectedLevel >= BOSS_FIGHT_LEVEL) return;

    // one new enemy killed submited
    killsUntilPowerUpRef.current--;

    if (killsUntilPowerUpRef.current === 0 && enemies.length > 0) {
      dispatch(addPowerUp(combatReport.lastKillPosition));
      // reset needed kills
      killsUntilPowerUpRef.current = KILLS_PER_POWERUP;
    }
  }, [combatReport.kills]);

  useEffect(() => {
    if (gameLevel.selectedLevel < BOSS_FIGHT_LEVEL) return;

    // one new bullet hitted submited
    hitsUntilPowerUpRef.current--;

    if (hitsUntilPowerUpRef.current === 0 && enemies.length > 0) {
      dispatch(addPowerUp([0, 30, 1]));
      // reset needed hitted bullets
      hitsUntilPowerUpRef.current = BULLETS_PER_POWERUP;
    }
  }, [combatReport.numOfBulletsThatHit]);
}
