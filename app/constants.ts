import { v4 as uuidv4 } from "uuid";
import type { EnemyType } from "./components/game/enemy";

// game constants
export const ENEMY_COLLISION_DAMAGE = 20;
export const BULLET_DAMAGE_LEVEL_1 = 15;
export const BULLET_DAMAGE_LEVEL_2 = 20;
export const BULLET_DAMAGE_LEVEL_3 = 30;
export const BLASTER_DAMAGE = 80;
export const ENEMY_SHOOT_DURATION = 2000;

// space ship constants
export const COOLING_RATE = 10;
export const HEAT_PER_SHOOT_BULLET = 5;
export const HEAT_PER_SHOOT_BLASTER = 20;
export const INVINCIBILITY_DURATION = 2000; // 2 seconds

// enemy attack wave
export const ATTACK_WAVE_LEVEL_1: EnemyType[] = generateAttackWave(
  {
    args: [3, 3, 1],
    color: "yellow",
    health: 100,
  },
  3,
  8,
  { x: -35, y: 50 }
);
export const ATTACK_WAVE_LEVEL_2 = generateAttackWave(
  {
    args: [3, 3, 1],
    color: "red",
    health: 100,
  },
  3,
  8,
  { x: -35, y: 50 }
);
export const ATTACK_WAVE_LEVEL_3 = generateAttackWave(
  {
    args: [3, 3, 1],
    color: "blue",
    health: 100,
  },
  3,
  8,
  { x: -35, y: 50 }
);

function generateAttackWave(
  enemyData: Omit<EnemyType, "id" | "position">,
  rows: number,
  cols: number,
  startPostion: { x: number; y: number }
) {
  const attackWave: EnemyType[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      attackWave.push({
        position: [startPostion.x + 10 * j, startPostion.y - 15 * i, 1],
        id: uuidv4(),
        ...enemyData,
      });
    }
  }
  return attackWave;
}

// collision data
export const COLLISION_GROUPS = {
  SPACESHIP: 1,
  ENEMY: 2,
  ENEMY_BULLET: 4,
  SPACESHIP_BULLET: 8,
  BLASTER: 16,
};

export const COLLISION_MASKS = {
  SPACESHIP: [COLLISION_GROUPS.ENEMY, COLLISION_GROUPS.ENEMY_BULLET],
  ENEMY: [COLLISION_GROUPS.SPACESHIP, COLLISION_GROUPS.SPACESHIP_BULLET],
  ENEMY_BULLET: [COLLISION_GROUPS.SPACESHIP, COLLISION_GROUPS.SPACESHIP_BULLET],
  SPACESHIP_BULLET: [COLLISION_GROUPS.ENEMY, COLLISION_GROUPS.ENEMY_BULLET],
  BLASTER: [COLLISION_GROUPS.ENEMY, COLLISION_GROUPS.ENEMY_BULLET],
};
