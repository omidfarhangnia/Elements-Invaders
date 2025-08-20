import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BulletType } from "~/components/game/bullet";
import type { EnemyType } from "~/components/game/enemy";
import { v4 as uuidv4 } from "uuid";
import { COOLING_RATE } from "~/constants";

interface GameStatus {
  bullets: BulletType[];
  enemies: EnemyType[];
  enemiesBullets: BulletType[];
  spaceShipHealth: number;
  spaceShipOverheat: number;
  isOverheated: boolean;
  isSpaceShipInvisible: boolean;
  bulletLevel: 1 | 2 | 3;
  gameStatus: "playing" | "ended" | "paused";
}

const initialState: GameStatus = {
  // all bullets are here (bullets will remove after moving out of scene)
  bullets: [],
  // all enemies are here (enemies will remove after death)
  enemies: [],
  // all enemies bullets are here (bullets will remove after moving out of scene)
  enemiesBullets: [],
  // space ship health is in percentage 0 <= health <= 100
  spaceShipHealth: 100,
  // space ship overheat is in percentage 0 <= overheat <= 100;
  spaceShipOverheat: 0,
  isOverheated: false,
  // space ship became invisible after collision with enemies
  isSpaceShipInvisible: false,
  // space ship selected bullet type
  bulletLevel: 1,
  // tracking game status (playing, ended, paused)
  gameStatus: "playing",
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeEnemies(state, action: PayloadAction<EnemyType[]>) {
      state.enemies = action.payload;
    },
    addBullet(state, action: PayloadAction<Omit<BulletType, "id">>) {
      if (state.isOverheated || state.gameStatus !== "playing") return;

      const newBullet = { ...action.payload, id: uuidv4() };
      state.bullets.push(newBullet);
      state.spaceShipOverheat += 5;

      if (state.spaceShipOverheat >= 100) {
        state.isOverheated = true;
      }
    },
    addEnemiseBullet(state, action: PayloadAction<Omit<BulletType, "id">>) {
      if (state.gameStatus !== "playing") return;

      const newBullet = { ...action.payload, id: uuidv4() };
      state.enemiesBullets.push(newBullet);
    },
    coolingSystem(state) {
      if (state.spaceShipOverheat <= 50 && state.isOverheated) {
        state.isOverheated = false;
      }

      if (state.spaceShipOverheat < COOLING_RATE) {
        state.spaceShipOverheat = 0;
      } else {
        state.spaceShipOverheat -= COOLING_RATE;
      }
    },
    removeBullet(
      state,
      action: PayloadAction<{
        id: string;
        bulletOwner: "spaceShip" | "enemy";
      }>
    ) {
      if (action.payload.bulletOwner === "spaceShip") {
        state.bullets = state.bullets.filter(
          (bullet) => bullet.id !== action.payload.id
        );
      } else if (action.payload.bulletOwner === "enemy") {
        state.enemiesBullets = state.enemiesBullets.filter(
          (bullet) => bullet.id !== action.payload.id
        );
      }
    },
    damageSpaceShip(state, action: PayloadAction<number>) {
      const newHealth = state.spaceShipHealth - action.payload;

      // game over
      if (newHealth <= 0) {
        state.gameStatus = "ended";
        state.spaceShipHealth = 0;
      }

      state.spaceShipHealth = newHealth;
    },
    damageEnemy(
      state,
      action: PayloadAction<{
        enemyId: string;
        bulletDamage: number;
      }>
    ) {
      const enemyIndex = state.enemies.findIndex(
        (enemy) => enemy.id === action.payload.enemyId
      );

      if (enemyIndex !== -1) {
        state.enemies[enemyIndex].health -= action.payload.bulletDamage;
        if (state.enemies[enemyIndex].health <= 0) {
          state.enemies = state.enemies.filter(
            (enemy) => enemy.id !== action.payload.enemyId
          );
        }
      }
    },
    toggleSpaceShipVisibility(state) {
      state.isSpaceShipInvisible = !state.isSpaceShipInvisible;
    },
  },
});

export const {
  initializeEnemies,
  addBullet,
  addEnemiseBullet,
  coolingSystem,
  removeBullet,
  damageSpaceShip,
  damageEnemy,
  toggleSpaceShipVisibility,
} = gameSlice.actions;
export default gameSlice.reducer;
