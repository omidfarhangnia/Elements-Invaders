import { useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { type Ref } from "react";
import { useAppSelector } from "~/RTK/hook";
import { COLLISION_GROUPS, COLLISION_MASKS } from "~/constants";
import { Model } from "~/routes/home";
import playerSpaceShip from "~/assets/models/player_space_ship.glb";
import { SpaceShipFire } from "~/routes/levels";

type SpaceShipProps = {
  startTheGunfire: () => void;
  shootTheBlaster: () => void;
  stopTheGunfire: () => void;
  ref: Ref<RapierRigidBody>;
  onCollision: (enemyId: string) => void;
};

export default function SpaceShip({
  startTheGunfire,
  shootTheBlaster,
  stopTheGunfire,
  ref,
  onCollision,
}: SpaceShipProps) {
  const { isSpaceShipInvisible, isShieldActive } = useAppSelector(
    (state) => state.game
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
          onCollision(other.rigidBodyObject.userData.id);
        }
      }}
    >
      <group>
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
        >
          <boxGeometry args={[6, 6, 1]} />
          <meshStandardMaterial opacity={0} transparent />
        </mesh>
        <pointLight color={"#ffffff"} intensity={150} position={[0, 6, 4]} />
        <pointLight color={"#FF9A00"} intensity={40} position={[0, -4, 3]} />
        <Model
          path={playerSpaceShip}
          scale={[10, 10, 10]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        <SpaceShipFire flameNumber={10} scale={[10, 9, 8]} />
        {isSpaceShipInvisible && (
          <mesh position={[0, -0.5, 2]}>
            <circleGeometry args={[8, 4]} />
            <meshBasicMaterial color={"#16a9ff"} opacity={0.1} transparent />
          </mesh>
        )}
        {!isShieldActive && (
          <mesh position={[0, -0.5, 2]}>
            <circleGeometry args={[8, 6]} />
            <meshBasicMaterial color={"#fff835"} opacity={0.1} transparent />
          </mesh>
        )}
      </group>

      <CuboidCollider args={[3, 3, 0.5]} sensor />
    </RigidBody>
  );
}

export function SpaceShipHealth() {
  const { viewport } = useThree();
  const spaceShipHealth = useAppSelector((state) => state.game.spaceShipHealth);

  const containerWidth = 25;
  const containerHeight = 5;

  const healthFraction = spaceShipHealth / 100;
  const healthPostionX = -(containerWidth * (1 - healthFraction)) / 2;

  return (
    <group
      position={[
        (containerWidth - viewport.width + viewport.width * 0.05) / 2,
        (containerHeight - viewport.height + 8) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[containerWidth, containerHeight]} />
        <meshBasicMaterial color="pink" />
      </mesh>
      <mesh scale-x={healthFraction} position={[healthPostionX, 0, 0.3]}>
        <planeGeometry args={[containerWidth - 5, containerHeight - 3]} />
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

  const containerWidth = 10;
  const containerHeight = 25;

  const engineFraction = spaceShipOverheat / 100;
  const enginePositionY = -(containerHeight * (1 - engineFraction)) / 2;

  return (
    <group
      position={[
        (viewport.width - containerWidth - viewport.width * 0.05) / 2,
        (containerHeight - viewport.height + 12) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[containerWidth, containerHeight + 4]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
      <mesh position={[0, enginePositionY, 0.2]} scale-y={engineFraction}>
        <planeGeometry
          scale={[0, 0]}
          args={[containerWidth - 4, containerHeight]}
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

  const containerSize = 15;

  return (
    <group
      position={[
        (containerSize - viewport.width + viewport.width * 0.05) / 2,
        (containerSize - viewport.height + 24) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[containerSize, containerSize]} />
        <meshBasicMaterial color="green" />
      </mesh>
      {Array.from({ length: numberOfBlasters }).map((_, index) => {
        return (
          <mesh
            position={[index * 3 - 6, 0, 0]}
            rotation-x={Math.PI / 2}
            key={index}
          >
            <cylinderGeometry args={[1, 1, 0.5, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        );
      })}
    </group>
  );
}

export function SpaceShipBulletLevel() {
  const { viewport } = useThree();
  const bulletLevel = useAppSelector((state) => state.game.bulletLevel);

  const containerWidth = 5;
  const containerHeight = 15;

  return (
    <group
      position={[
        (containerWidth - viewport.width + 50) / 2,
        (containerHeight - viewport.height + 24) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[containerWidth, containerHeight]} />
        <meshBasicMaterial color="pink" />
      </mesh>
      {Array.from({ length: bulletLevel }).map((_, index) => {
        return (
          <mesh position={[0, index * 3 - 3, 0.3]} key={index}>
            <planeGeometry
              args={[containerWidth * 0.7, containerHeight * 0.1]}
            />
            <meshBasicMaterial color="red" />
          </mesh>
        );
      })}
    </group>
  );
}

export function SpaceShipShieldState() {
  const { viewport } = useThree();
  const isShieldActive = useAppSelector((state) => state.game.isShieldActive);

  const containerWidth = 10;
  const containerHeight = 10;

  return (
    <group
      position={[
        (viewport.width - containerWidth - viewport.width * 0.05) / 2,
        (containerHeight - viewport.height + 70) / 2,
        3,
      ]}
    >
      <mesh>
        <planeGeometry args={[containerWidth, containerHeight]} />
        <meshBasicMaterial color="pink" />
      </mesh>
      {isShieldActive && (
        <mesh>
          <boxGeometry
            args={[containerWidth * 0.6, containerHeight * 0.6, 0.5]}
          />
          <meshBasicMaterial color="blue" />
        </mesh>
      )}
    </group>
  );
}
