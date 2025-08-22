import { useRef } from "react";
import {
  BLASTER_DAMAGE,
  BULLET_DAMAGE_LEVEL_1,
  BULLET_DAMAGE_LEVEL_2,
  BULLET_DAMAGE_LEVEL_3,
  ENEMY_COLLISION_DAMAGE,
  INVINCIBILITY_DURATION,
} from "~/constants";
import {
  damageEnemy,
  damageSpaceShip,
  removeAmmo,
  removePowerUp,
  setPowerUp,
  toggleSpaceShipVisibility,
  type PowerUpType,
} from "~/features/game/game-slice";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";

export default function useCollisionHandler() {
  const { bulletLevel, isSpaceShipInvisible } = useAppSelector(
    (state) => state.game
  );
  const dispatch = useAppDispatch();
  // prevent duplicate collisions from being recorded
  const collisionEventsRef = useRef({
    spaceShipAmmo: new Set<string>(),
    enemyAmmo: new Set<string>(),
    spaceShip: false,
    powerUp: new Set<string>(),
  });

  function deleteAmmo(
    id: string,
    ammoType: "spaceShipBullet" | "enemyBullet" | "spaceShipBlaster"
  ) {
    dispatch(removeAmmo({ id, ammoType }));
  }

  function calcAmmoDamage(ammoType: "spaceShipBullet" | "spaceShipBlaster") {
    if (ammoType === "spaceShipBullet") {
      switch (bulletLevel) {
        case 1:
          return BULLET_DAMAGE_LEVEL_1;
        case 2:
          return BULLET_DAMAGE_LEVEL_2;
        case 3:
          return BULLET_DAMAGE_LEVEL_3;
      }
    } else {
      return BLASTER_DAMAGE;
    }
  }

  function collisionAmmoToEnemy(
    bulletId: string,
    enemyId?: string,
    ammoType?: "spaceShipBullet" | "spaceShipBlaster"
  ) {
    if (enemyId === undefined || ammoType === undefined) return;
    // prevent duplicate collisions from being recorded
    if (collisionEventsRef.current.spaceShipAmmo.has(bulletId)) {
      return;
    }
    collisionEventsRef.current.spaceShipAmmo.add(bulletId);

    deleteAmmo(bulletId, ammoType);

    const bulletDamage = calcAmmoDamage(ammoType);

    dispatch(damageEnemy({ enemyId, bulletDamage }));
  }

  function makeVisibleSpaceShip() {
    setTimeout(() => {
      // now is visible
      dispatch(toggleSpaceShipVisibility());
      collisionEventsRef.current.spaceShip = false;
    }, INVINCIBILITY_DURATION);
  }

  function collisionBulletToSpaceShip(bulletId: string) {
    if (
      collisionEventsRef.current.enemyAmmo.has(bulletId) ||
      isSpaceShipInvisible
    ) {
      return;
    }
    collisionEventsRef.current.enemyAmmo.add(bulletId);

    const damage = 20;

    deleteAmmo(bulletId, "enemyBullet");

    // now is not visibile
    dispatch(toggleSpaceShipVisibility());
    dispatch(damageSpaceShip(damage));

    makeVisibleSpaceShip();
  }

  function collisionSpaceShipToEnemy() {
    // prevent duplicate collisions from being recorded or calculating damage for invisible space ship
    if (collisionEventsRef.current.spaceShip || isSpaceShipInvisible) return;
    collisionEventsRef.current.spaceShip = true;

    // now is not visibile
    dispatch(toggleSpaceShipVisibility());
    dispatch(damageSpaceShip(ENEMY_COLLISION_DAMAGE));

    makeVisibleSpaceShip();
  }

  function collisionPowerUpToSpaceShip(powerUp: PowerUpType) {
    // prevent duplicate collisions from being recorded or calculating damage for invisible space ship
    if (collisionEventsRef.current.powerUp.has(powerUp.id)) return;
    collisionEventsRef.current.powerUp.add(powerUp.id);

    dispatch(setPowerUp(powerUp.type));
    dispatch(removePowerUp(powerUp.id));
  }

  function deletePowerUp(powerUpId: string) {
    dispatch(removePowerUp(powerUpId));
  }

  return {
    collisionAmmoToEnemy,
    collisionBulletToSpaceShip,
    collisionSpaceShipToEnemy,
    collisionPowerUpToSpaceShip,
    deletePowerUp,
    deleteAmmo,
  };
}
