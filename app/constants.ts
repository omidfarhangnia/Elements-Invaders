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
export const ATTACK_WAVE_LEVEL_1: EnemyType[] = [
  {
    position: [-35, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-25, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-15, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-5, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [5, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [15, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [25, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [35, 50, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-35, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-25, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-15, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-5, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [5, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [15, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [25, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [35, 35, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-35, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-25, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-15, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [-5, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [5, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [15, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [25, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
  {
    position: [35, 20, 1],
    args: [3, 3, 1],
    color: "yellow",
    id: uuidv4(),
    health: 100,
  },
];
export const ATTACK_WAVE_LEVEL_2 = [];
export const ATTACK_WAVE_LEVEL_3 = [];

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
