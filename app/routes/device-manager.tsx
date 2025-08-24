import { useEffect, useState } from "react";
import { Outlet } from "react-router";

function MobileMessage() {
  return (
    <div className="w-full h-[100dvh] bg-custom-black text-center px-[1.5rem] flex flex-col items-center justify-center gap-[1.5rem] md:gap-[3rem]">
      <h1 className="font-exo2 text-white text-[2.5rem] md:text-[4rem] md:leading-[5rem] leading-[3rem]">
        Best Experienced on Desktop
      </h1>
      <h2 className="font-roboto text-custom-pink text-[1.25rem] md:text-[2rem] max-w-[700px]">
        This game is designed for mouse and keyboard. Please visit us on your PC
        or laptop for the full experience!
      </h2>
    </div>
  );
}

export default function DeviceManager() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  if (isTouchDevice) {
    return <MobileMessage />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
