import { Canvas } from "@react-three/fiber";
import BattlegroundScene from "~/components/world/battlegroundScene";
import { FaHeart } from "react-icons/fa";
import { GiBlaster } from "react-icons/gi";
import { FaGripfire } from "react-icons/fa6";
import { BsFillShieldFill } from "react-icons/bs";
import { BsShieldSlash } from "react-icons/bs";
import { useAppSelector } from "~/RTK/hook";
import { useEffect, useState } from "react";
import {
  BULLET_DAMAGE_LEVEL_1,
  BULLET_DAMAGE_LEVEL_2,
  BULLET_DAMAGE_LEVEL_3,
} from "~/constants";

function BattleGround() {
  const {
    spaceShipHealth,
    numberOfBlasters,
    bulletLevel,
    spaceShipOverheat,
    isShieldActive,
  } = useAppSelector((state) => state.game);
  const [bulletDamage, setBulletDamage] = useState(0);

  useEffect(() => {
    switch (bulletLevel) {
      case 1:
        setBulletDamage(BULLET_DAMAGE_LEVEL_1);
        break;
      case 2:
        setBulletDamage(BULLET_DAMAGE_LEVEL_2);
        break;
      case 3:
        setBulletDamage(BULLET_DAMAGE_LEVEL_3);
        break;
    }
  }, [bulletLevel]);

  return (
    <div className="w-full h-[100dvh] relative cursor-none">
      <div className="absolute w-full h-full top-0 left-0">
        <Canvas
          camera={{
            position: [0, 0, 100],
            fov: 75,
            near: 0.1,
            far: 600,
          }}
          className="bg-space"
        >
          <BattlegroundScene />
        </Canvas>
      </div>
      {/* space ship health bar */}
      <div className="fixed bottom-[10px] left-[10px] min-w-[350px] flex justify-between items-center px-[10px] bg-[#ffffff10] rounded-[10px] h-[55px]">
        <div className="w-[90%] h-[40%]">
          <div
            className={`rounded-full h-full transition-all ${spaceShipHealth > 60 ? "bg-[#c81823]" : "bg-[#ff6812]"}`}
            style={{ width: `${spaceShipHealth}%` }}
          ></div>
        </div>
        <FaHeart size={26} color="#c81823" />
      </div>
      {/* number of blasters remaining*/}
      <div className="fixed bottom-[75px] left-[10px] w-[100px] h-[100px] flex flex-col justify-center items-center rounded-[10px] bg-[#ffffff10]">
        <GiBlaster size={40} color="#ff5d00" />
        <span
          className={`text-[#ffffff] font-exo2 text-[2rem] leading-[2rem] ${numberOfBlasters === 0 && "text-red-300"}`}
        >
          {numberOfBlasters}x
        </span>
      </div>
      {/* space ship bullet level */}
      <div className="fixed bottom-[75px] left-[120px] w-[160px] h-[70px] flex flex-col justify-center items-center rounded-[10px] bg-[#ffffff10]">
        <span className={`text-[#ffffff] font-exo2 capitalize`}>
          bullet level : {bulletLevel}
        </span>
        <span className={`text-[#6c757d] font-exo2 text-[.7rem] capitalize`}>
          bullet damage : {bulletDamage}
        </span>
      </div>
      {/* space ship heat state */}
      <div className="fixed bottom-[10px] right-[10px] w-[65px] h-[250px] p-[10px] gap-[10px] flex flex-col justify-center items-center rounded-[10px] bg-[#ffffff10]">
        <FaGripfire size={40} color="#e43b12" />
        <div className="h-full w-full bg-[#7a7f80] rounded-full overflow-hidden flex items-end">
          <div
            className={`rounded-[10px] w-full h-full transition-all ${spaceShipOverheat > 60 ? "bg-[#c81823]" : spaceShipOverheat > 30 ? "bg-[#ff6812]" : "bg-[#90ee90]"}`}
            style={{ height: `${spaceShipOverheat}%` }}
          ></div>{" "}
        </div>
      </div>
      <div className="fixed bottom-[270px] right-[10px] w-[65px] h-[65px] p-[10px] flex justify-center items-center rounded-[10px] bg-[#ffffff10]">
        {isShieldActive ? (
          <BsFillShieldFill size={30} color="#d3c032" />
        ) : (
          <BsShieldSlash size={30} color="#d3c032" />
        )}
      </div>
    </div>
  );
}

export default BattleGround;
