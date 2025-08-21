import { useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { type Ref } from "react";
import { useAppSelector } from "~/RTK/hook";
import { Text } from "@react-three/drei";
import { COLLISION_GROUPS, COLLISION_MASKS } from "~/constants";

type SpaceShipProps = {
  startTheGunfire: () => void;
  shootTheBlaster: () => void;
  stopTheGunfire: () => void;
  ref: Ref<RapierRigidBody>;
  onCollision: () => void;
};

export default function SpaceShip({
  startTheGunfire,
  shootTheBlaster,
  stopTheGunfire,
  ref,
  onCollision,
}: SpaceShipProps) {
  const isSpaceShipInvisible = useAppSelector(
    (state) => state.game.isSpaceShipInvisible
  );

  return (
    <RigidBody
      type="kinematicPosition"
      name="spaceShip"
      ref={ref}
      gravityScale={0}
      colliders={false}
      collisionGroups={interactionGroups(
        COLLISION_GROUPS.SPACESHIP,
        COLLISION_MASKS.SPACESHIP
      )}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "enemy") {
          onCollision();
        }
      }}
    >
      <mesh
        /* pointer event for firing */
        onPointerDown={(e) => {
          if (e.nativeEvent.button === 0) {
            // left click
            startTheGunfire();
          } else if (e.nativeEvent.button === 2) {
            // right click
            shootTheBlaster();
          }
        }}
        onPointerUp={(e) => {
          if (e.nativeEvent.button === 0) {
            // left click
            stopTheGunfire();
          }
        }}
        onPointerLeave={stopTheGunfire}
        position={[0, 0, 1]}
        scale={1}
      >
        <boxGeometry args={[5, 5, 1]} />
        <meshStandardMaterial
          color="blue"
          opacity={isSpaceShipInvisible ? 0.3 : 1.0}
          transparent
        />
      </mesh>

      <CuboidCollider args={[2.5, 2.5, 0.5]} sensor />
    </RigidBody>
  );
}

export function SpaceShipHealth() {
  const { viewport } = useThree();
  const spaceShipHealth = useAppSelector((state) => state.game.spaceShipHealth);

  const healthBarWidth = 25;
  const healthBarHeight = 5;

  const healthFraction = spaceShipHealth / 100;
  const healthPostionX = -(healthBarWidth * (1 - healthFraction)) / 2;

  return (
    <group
      position={[
        (healthBarWidth - viewport.width + 8) / 2,
        (healthBarHeight - viewport.height + 8) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[healthBarWidth, healthBarHeight]} />
        <meshBasicMaterial color="pink" />
      </mesh>
      <mesh scale-x={healthFraction} position={[healthPostionX, 0, 0.3]}>
        <planeGeometry args={[healthBarWidth - 5, healthBarHeight - 3]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
}

export function SpaceShipOverheat() {
  const { viewport } = useThree();
  const spaceShipOverheat = useAppSelector(
    (state) => state.game.spaceShipOverheat
  );

  const engineBarWidth = 10;
  const engineBarHeight = 25;

  const engineFraction = spaceShipOverheat / 100;
  const enginePositionY = -(engineBarHeight * (1 - engineFraction)) / 2;

  return (
    <group
      position={[
        (viewport.width - engineBarWidth - 8) / 2,
        (engineBarHeight - viewport.height + 12) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[engineBarWidth, engineBarHeight + 4]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
      <mesh position={[0, enginePositionY, 0.2]} scale-y={engineFraction}>
        <planeGeometry
          scale={[0, 0]}
          args={[engineBarWidth - 4, engineBarHeight]}
        />
        <meshBasicMaterial
          color={
            spaceShipOverheat < 40
              ? "lime"
              : spaceShipOverheat < 80
                ? "orange"
                : "red"
          }
        />
      </mesh>
    </group>
  );
}

export function SpaceShipAmmo() {
  const { viewport } = useThree();
  const numberOfBlasters = useAppSelector(
    (state) => state.game.numberOfBlasters
  );

  const ammoBarSideSize = 15;

  return (
    <group
      position={[
        (ammoBarSideSize - viewport.width + 10) / 2,
        (ammoBarSideSize - viewport.height + 24) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[ammoBarSideSize, ammoBarSideSize]} />
        <meshBasicMaterial color="green" />
      </mesh>
      <Text position={[0, 0, 0.3]} color="blue" fontSize={7}>
        {numberOfBlasters}
      </Text>
    </group>
  );
}
