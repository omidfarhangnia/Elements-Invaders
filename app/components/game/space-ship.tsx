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
        {isShieldActive && (
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
