import { useEffect, useRef } from "react";
import { BOSS_FIGHT_LEVEL, BOSS_FIGHT_SHOOT_DURATION, ENEMY_SHOOT_DURATION } from "~/constants";
import { addEnemiseBullet } from "~/features/game/game-slice";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";

export default function useEnemyShooting(
  args: [number, number, number],
  color: string
) {
  const dispatch = useAppDispatch();
  const { gameStatus, enemies, gameLevel } = useAppSelector(
    (state) => state.game
  );

  const shotEnemiesRef = useRef(new Set<string>());
  const enemyBulletIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    function enemyShoot() {
      if (enemies.length === 0) return;

      let eligibleEnemies = enemies.filter(
        (enemy) => !shotEnemiesRef.current.has(enemy.id)
      );

      if (eligibleEnemies.length === 0) {
        shotEnemiesRef.current.clear();
        eligibleEnemies = enemies;
      }

      const randomIndex = Math.floor(Math.random() * eligibleEnemies.length);
      const shootingEnemy = eligibleEnemies[randomIndex];

      if (!shootingEnemy) return;

      shotEnemiesRef.current.add(shootingEnemy.id);

      dispatch(
        addEnemiseBullet({
          position: [
            shootingEnemy.position[0],
            shootingEnemy.position[1] - 2,
            1,
          ],
          args,
          color,
          type: "bullet",
        })
      );
    }

    function bossFightShoot() {
      if (enemies.length === 0) return;
      const bossFight = enemies[0];

      const xPosition =
        Math.floor((Math.random() * bossFight.args[0]) / 2) *
        (Math.floor(Math.random() * 2) % 2 === 0 ? 1 : -1);
      const yPosition = 35;

      dispatch(
        addEnemiseBullet({
          position: [xPosition, yPosition, 1],
          args,
          color,
          type: "bullet",
        })
      );
    }

    if (gameStatus === "playing" && gameLevel.selectedLevel < BOSS_FIGHT_LEVEL) {
      enemyBulletIntervalRef.current = setInterval(
        enemyShoot,
        ENEMY_SHOOT_DURATION
      );
    } else if (gameStatus === "playing" && gameLevel.selectedLevel === BOSS_FIGHT_LEVEL) {
      enemyBulletIntervalRef.current = setInterval(
        bossFightShoot,
        BOSS_FIGHT_SHOOT_DURATION
      );
    }

    return () => {
      if (enemyBulletIntervalRef.current) {
        clearInterval(enemyBulletIntervalRef.current);
      }
    };
  }, [gameStatus, enemies.length, dispatch]);
}
