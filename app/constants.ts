import { v4 as uuidv4 } from "uuid";
import type { EnemyType } from "./components/game/enemy";

// game constants
export const ENEMY_COLLISION_DAMAGE = 20;
export const BULLET_DAMAGE_LEVEL_1 = 15;
export const BULLET_DAMAGE_LEVEL_2 = 20;
export const BULLET_DAMAGE_LEVEL_3 = 30;
export const BOSS_FIGHT_LEVEL = 3;
export const BLASTER_DAMAGE = 80;
export const ENEMY_SHOOT_DURATION = 1000;
export const BOSS_FIGHT_SHOOT_DURATION = 700;
export const KILLS_PER_POWERUP = 3; // you must kill 3 enemies to get a power up
export const BULLETS_PER_POWERUP = 20; // you must shoot 5 bullets at enemies to get power up

// space ship constants
export const COOLING_RATE = 10;
export const HEAT_PER_SHOOT_BULLET = 5;
export const HEAT_PER_SHOOT_BLASTER = 20;
export const INVINCIBILITY_DURATION = 2000; // 2 seconds

// enemy attack wave
export const ATTACK_WAVE_LEVEL_1_COL_NUM = 3;
export const ATTACK_WAVE_LEVEL_1_ROW_NUM = 5;
export const ATTACK_WAVE_LEVEL_1: EnemyType[] = generateAttackWave(
  {
    args: [6.5, 6.5, 1],
    health: 100,
  },
  1,
  ATTACK_WAVE_LEVEL_1_COL_NUM,
  ATTACK_WAVE_LEVEL_1_ROW_NUM,
  { x: -30, y: 50 }
);
export const ATTACK_WAVE_LEVEL_2_COL_NUM = 3;
export const ATTACK_WAVE_LEVEL_2_ROW_NUM = 5;
export const ATTACK_WAVE_LEVEL_2: EnemyType[] = generateAttackWave(
  {
    args: [6.5, 6.5, 1],

    health: 200,
  },
  2,
  ATTACK_WAVE_LEVEL_2_COL_NUM,
  ATTACK_WAVE_LEVEL_2_ROW_NUM,
  { x: -30, y: 50 }
);
export const ATTACK_WAVE_LEVEL_3_COL_NUM = 1;
export const ATTACK_WAVE_LEVEL_3_ROW_NUM = 1;
export const ATTACK_WAVE_LEVEL_3: EnemyType[] = generateAttackWave(
  {
    args: [85, 35, 1],
    health: 2000,
  },
  3,
  ATTACK_WAVE_LEVEL_3_COL_NUM,
  ATTACK_WAVE_LEVEL_3_ROW_NUM,
  { x: 0, y: 60 }
);

function generateAttackWave(
  enemyData: Omit<
    EnemyType,
    "id" | "position" | "colData" | "rowData" | "attackWaveLevel"
  >,
  attackWaveLevel: number,
  rows: number,
  cols: number,
  startPostion: { x: number; y: number }
) {
  const isBossFight = attackWaveLevel === BOSS_FIGHT_LEVEL;

  if (isBossFight) {
    return [
      {
        position: [startPostion.x, startPostion.y, 1] as [number, number, 1],
        id: uuidv4(),
        ...enemyData,
        rowData: { enemyRow: 1, rowNum: rows },
        colData: { enemyCol: 1, colNum: cols },
        attackWaveLevel: attackWaveLevel,
      },
    ];
  }

  const attackWave: EnemyType[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      attackWave.push({
        position: [startPostion.x + 15 * j, startPostion.y - 15 * i, 1],
        id: uuidv4(),
        ...enemyData,
        rowData: { enemyRow: i, rowNum: rows },
        colData: { enemyCol: j, colNum: cols },
        attackWaveLevel: attackWaveLevel,
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
  POWERUP: 32,
};

export const COLLISION_MASKS = {
  SPACESHIP: [
    COLLISION_GROUPS.ENEMY,
    COLLISION_GROUPS.ENEMY_BULLET,
    COLLISION_GROUPS.POWERUP,
  ],
  ENEMY: [COLLISION_GROUPS.SPACESHIP, COLLISION_GROUPS.SPACESHIP_BULLET],
  ENEMY_BULLET: [COLLISION_GROUPS.SPACESHIP, COLLISION_GROUPS.SPACESHIP_BULLET],
  SPACESHIP_BULLET: [COLLISION_GROUPS.ENEMY, COLLISION_GROUPS.ENEMY_BULLET],
  BLASTER: [COLLISION_GROUPS.ENEMY, COLLISION_GROUPS.ENEMY_BULLET],
  POWERUP: [COLLISION_GROUPS.SPACESHIP],
};
