import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AmmoType, Position } from "~/components/game/bullet";
import type { EnemyType } from "~/components/game/enemy";
import { v4 as uuidv4 } from "uuid";
import {
  COOLING_RATE,
  HEAT_PER_SHOOT_BLASTER,
  HEAT_PER_SHOOT_BULLET,
} from "~/constants";

export interface PowerUpType {
  position: Position;
  args: [number];
  color: string;
  id: string;
  type: "increaseHealthAmount" | "increaseBlasterNum" | "levelUpBullet";
}

interface GameStatus {
  bullets: AmmoType[];
  enemies: EnemyType[];
  blasters: AmmoType[];
  powerUps: PowerUpType[];
  killStatus: { count: number; lastKillPosition: Position };
  numberOfBlasters: number;
  enemiesBullets: AmmoType[];
  spaceShipHealth: number;
  spaceShipOverheat: number;
  isOverheated: boolean;
  isSpaceShipInvisible: boolean;
  bulletLevel: 1 | 2 | 3;
  gameStatus: "playing" | "ended" | "paused";
  gameLevel: { lastOpenedLevel: number; selectedLevel: number };
}

const initialState: GameStatus = {
  // all bullets are here (bullets will remove after moving out of scene)
  bullets: [],
  // all enemies are here (enemies will remove after death)
  enemies: [],
  // all blasters are here (blaster will remove after moving out of scene)
  blasters: [],
  // all powerUp items which currently located in scene are in this array
  powerUps: [],
  // some data about kills
  killStatus: { count: 0, lastKillPosition: [0, 0, 1] },
  // number of blasters remaining
  numberOfBlasters: 3,
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
  // controlling level state
  gameLevel: { lastOpenedLevel: 1, selectedLevel: 1 },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeEnemies(state, action: PayloadAction<EnemyType[]>) {
      state.enemies = action.payload;
    },
    addAmmo(state, action: PayloadAction<Omit<AmmoType, "id">>) {
      if (state.isOverheated || state.gameStatus !== "playing") return;

      const newAmmo = { ...action.payload, id: uuidv4() };

      if (action.payload.type === "bullet") {
        // we cant shoot if we dont have enough capacity
        if (100 - state.spaceShipOverheat < HEAT_PER_SHOOT_BULLET) {
          state.isOverheated = true;
          return;
        }
        state.bullets.push(newAmmo);
        state.spaceShipOverheat += HEAT_PER_SHOOT_BULLET;
      } else if (action.payload.type === "blaster") {
        // we cant shoot if we dont have enough capacity
        if (100 - state.spaceShipOverheat < HEAT_PER_SHOOT_BLASTER) {
          state.isOverheated = true;
          return;
        }

        if (state.numberOfBlasters > 0) {
          state.blasters.push(newAmmo);
          state.spaceShipOverheat += HEAT_PER_SHOOT_BLASTER;
          state.numberOfBlasters--;
        }
      }

      if (state.spaceShipOverheat >= 100) {
        state.isOverheated = true;
      }
    },
    addEnemiseBullet(state, action: PayloadAction<Omit<AmmoType, "id">>) {
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
    removeAmmo(
      state,
      action: PayloadAction<{
        id: string;
        ammoType: "spaceShipBullet" | "enemyBullet" | "spaceShipBlaster";
      }>
    ) {
      if (action.payload.ammoType === "spaceShipBullet") {
        state.bullets = state.bullets.filter(
          (bullet) => bullet.id !== action.payload.id
        );
      } else if (action.payload.ammoType === "enemyBullet") {
        state.enemiesBullets = state.enemiesBullets.filter(
          (bullet) => bullet.id !== action.payload.id
        );
      } else if (action.payload.ammoType === "spaceShipBlaster") {
        state.blasters = state.blasters.filter(
          (blaster) => blaster.id !== action.payload.id
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
          // filling killStatus state
          state.killStatus.count++;
          state.killStatus.lastKillPosition =
            state.enemies[enemyIndex].position;
          // removing dead enemies
          state.enemies = state.enemies.filter(
            (enemy) => enemy.id !== action.payload.enemyId
          );
        }
      }
    },
    toggleSpaceShipVisibility(state) {
      state.isSpaceShipInvisible = !state.isSpaceShipInvisible;
    },
    addPowerUp(state, action: PayloadAction<Position>) {
      const availableTypes = new Set<PowerUpType["type"]>([
        "increaseHealthAmount",
        "increaseBlasterNum",
        "levelUpBullet",
      ]);

      // we dont want to give useless power up
      if (state.spaceShipHealth === 100)
        availableTypes.delete("increaseHealthAmount");
      if (state.bulletLevel === 3) availableTypes.delete("levelUpBullet");
      if (state.numberOfBlasters >= 5)
        availableTypes.delete("increaseBlasterNum");

      const availableTypesArray = [...availableTypes];

      if (availableTypesArray.length === 0) return;

      const randomIndex = Math.floor(
        Math.random() * availableTypesArray.length
      );
      const newPowerUp: PowerUpType = {
        args: [1],
        color: "purple",
        id: uuidv4(),
        position: action.payload,
        type: availableTypesArray[randomIndex],
      };
      state.powerUps.push(newPowerUp);
    },
    removePowerUp(state, action: PayloadAction<string>) {
      state.powerUps = state.powerUps.filter(
        (bullet) => bullet.id !== action.payload
      );
    },
    setPowerUp(state, action: PayloadAction<PowerUpType["type"]>) {
      if (action.payload === "increaseBlasterNum") {
        if (state.numberOfBlasters >= 5) return;
        state.numberOfBlasters++;
      } else if (action.payload === "increaseHealthAmount") {
        if (state.spaceShipHealth === 100) return;
        state.spaceShipHealth += 20;
      } else {
        if (state.bulletLevel === 3) return;
        state.bulletLevel++;
      }
    },
  },
});

export const {
  initializeEnemies,
  addAmmo,
  addEnemiseBullet,
  coolingSystem,
  removeAmmo,
  damageSpaceShip,
  damageEnemy,
  toggleSpaceShipVisibility,
  addPowerUp,
  removePowerUp,
  setPowerUp,
} = gameSlice.actions;
export default gameSlice.reducer;
