import { Canvas } from "@react-three/fiber";
import BattlegroundScene from "~/components/world/battlegroundScene";
import { FaHeart } from "react-icons/fa";
import { GiBlaster } from "react-icons/gi";
import { FaGripfire } from "react-icons/fa6";
import { BsFillShieldFill } from "react-icons/bs";
import { BsShieldSlash } from "react-icons/bs";
import { FaPause } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "~/RTK/hook";
import { useEffect, useState } from "react";
import {
  BULLET_DAMAGE_LEVEL_1,
  BULLET_DAMAGE_LEVEL_2,
  BULLET_DAMAGE_LEVEL_3,
} from "~/constants";
import {
  setGameStatus,
  setLevel,
  updateLevel,
} from "~/features/game/game-slice";
import { Link } from "react-router";
import { enemyArrangements } from "./levels";

function BattleGround() {
  const {
    spaceShipHealth,
    numberOfBlasters,
    bulletLevel,
    spaceShipOverheat,
    isShieldActive,
    gameLevel,
    gameStatus,
  } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const [bulletDamage, setBulletDamage] = useState(0);

  useEffect(() => {
    dispatch(setGameStatus("playing"));
  }, []);

  useEffect(() => {
    const lastOpenedLevel =
      Number(sessionStorage.getItem("lastOpenedLevel")) || 1;
    const selectedLevel = Number(sessionStorage.getItem("selectedLevel")) || 1;
    dispatch(updateLevel({ lastOpenedLevel, selectedLevel }));
  }, []);

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
          frameloop={gameStatus === "playing" ? "always" : "demand"}
        >
          <BattlegroundScene isPaused={gameStatus !== "playing"} />
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
      {/* space ship shield status */}
      <div className="fixed bottom-[270px] right-[10px] w-[65px] h-[65px] p-[10px] flex justify-center items-center rounded-[10px] bg-[#ffffff10]">
        {isShieldActive ? (
          <BsFillShieldFill size={30} color="#d3c032" />
        ) : (
          <BsShieldSlash size={30} color="#d3c032" />
        )}
      </div>
      {/* space ship pause button and menu */}
      {gameStatus === "playing" ? (
        // pause button
        <div
          onClick={() => dispatch(setGameStatus("paused"))}
          className="fixed top-[10px] cursor-pointer right-[10px] w-[65px] h-[65px] p-[10px] flex justify-center items-center rounded-[10px] bg-[#ffffff10]"
        >
          <FaPause size={25} color="#e5e5e5" />
        </div>
      ) : (
        gameStatus !== "" && (
          // paused menu
          <div className="w-full h-full fixed cursor-default top-0 left-0 bg-[#ffffff10] flex items-center justify-center">
            <div className="w-full h-full bg-[#000000] flex flex-col items-center justify-center gap-[2rem] text-[#ffffff]">
              <h1 className="text-[2.5rem] font-exo2 capitalize text-shadow-[2px_2px_15px_#ffffff]">
                {gameStatus === "paused" &&
                  `current level : ${gameLevel.selectedLevel}`}
                {gameStatus === "ended-losed" && `you losed`}
                {gameStatus === "ended-won" &&
                  (gameLevel.selectedLevel !== enemyArrangements.length
                    ? "you won"
                    : "you saved the galaxy")}
              </h1>
              {gameStatus === "paused" && (
                <div
                  onClick={() => dispatch(setGameStatus("playing"))}
                  className="bg-[#ffffff10] transition-all min-w-[200px] hover:bg-transparent disabled:hover:bg-[#ffffff10] text-center w-[40%] max-w-[350px] min-h-[60px] flex items-center justify-center"
                >
                  <span className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block w-full h-full content-center">
                    resume
                  </span>
                </div>
              )}
              {(gameStatus === "ended-losed" || gameStatus === "paused") && (
                <div className="bg-[#ffffff10] transition-all min-w-[200px] hover:bg-transparent disabled:hover:bg-[#ffffff10] text-center w-[40%] max-w-[350px] min-h-[60px] flex items-center justify-center">
                  <Link
                    to={"/battleground"}
                    reloadDocument
                    className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block w-full h-full content-center"
                  >
                    restart
                  </Link>
                </div>
              )}
              {gameStatus === "ended-won" &&
                (gameLevel.selectedLevel !== enemyArrangements.length ? (
                  <div className="bg-[#ffffff10] transition-all min-w-[200px] hover:bg-transparent disabled:hover:bg-[#ffffff10] text-center w-[40%] max-w-[350px] min-h-[60px] flex items-center justify-center">
                    <Link
                      to={"/battleground"}
                      onClick={() =>
                        dispatch(setLevel(gameLevel.selectedLevel + 1))
                      }
                      className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block w-full h-full content-center"
                    >
                      next level
                    </Link>
                  </div>
                ) : (
                  <div className="bg-[#ffffff10] transition-all min-w-[200px] hover:bg-transparent disabled:hover:bg-[#ffffff10] text-center w-[40%] max-w-[350px] min-h-[60px] flex items-center justify-center">
                    <Link
                      to={"/"}
                      reloadDocument
                      className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block w-full h-full content-center"
                    >
                      home
                    </Link>
                  </div>
                ))}
              <div className="bg-[#ffffff10] transition-all min-w-[200px] hover:bg-transparent disabled:hover:bg-[#ffffff10] text-center w-[40%] max-w-[350px] min-h-[60px] flex items-center justify-center">
                <Link
                  to={"/levels"}
                  reloadDocument
                  className="text-[1.8rem] text-white font-roboto capitalize text-center border-custom hover:border-white block w-full h-full content-center"
                >
                  level page
                </Link>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default BattleGround;
