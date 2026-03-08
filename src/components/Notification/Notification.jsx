import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { useState } from "react";
import { Link } from "react-router-dom";

function Notification() {
  const [notifyIsClicked, setnotifyIsClicked] = useState(false);
  //   const handleOutsideClick = useCallback(() => {
  //     setnotifyIsClicked(false);
  //   }, []);

  //   useEffect(() => {
  //     document.addEventListener("mousedown", handleOutsideClick);

  //     return () => {
  //       document.removeEventListener("mousedown", handleOutsideClick);
  //     };
  //   }, [handleOutsideClick]);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setnotifyIsClicked(!notifyIsClicked);
        }}
        className="animate__animated animate__swing animate__infinite before-glow relative flex items-center p-1 before:min-h-5 before:min-w-5 before:content-center hover:text-black max-md:h-6 max-md:w-6 md:h-8 md:w-8"
      >
        <FontAwesomeIcon
          icon={ICONS.Bell}
          className="cursor-pointer text-(--color-text-interactive) hover:text-white max-md:text-[14px] md:text-2xl"
        />
      </button>
      <div
        className={` ${notifyIsClicked ? "block" : "hidden"} absolute top-10 -left-60 h-fit min-w-2xs items-center rounded-[20px] border-2 border-solid border-transparent bg-(--color-input) opacity-[0.8] shadow-[0_0_10px_#00ffff,0_0_15px_#00ffff] max-md:w-fit`}
      >
        <h3 className="border-b-2 border-b-(--color-border) bg-linear-to-r from-[#3b82f6] to-[#0ea5e9] bg-clip-text p-5 font-bold text-transparent max-md:p-2 max-md:text-[13px] md:text-[16px] 2xl:text-[20px]">
          Notifications
        </h3>
        <div className="flex flex-col justify-between gap-2 opacity-100 *:relative *:border-b-2 *:border-b-(--color-border) *:pt-4 *:pr-4 *:pb-4 *:pl-10 *:text-[14px] *:text-white *:capitalize *:before:absolute *:before:top-6.75 *:before:left-3.25 *:before:h-2 *:before:w-2 *:before:rounded-[50%] *:before:bg-(--color-secondary) *:before:content-[''] *:max-md:pt-2 *:max-md:pr-1 *:max-md:pb-2 *:max-md:pl-8 *:max-md:text-[12px]">
          <div className="before-animate-opacity flex flex-col">
            <p>
              new comment on
              <span className="bg-linear-to-r from-[#3b82f6] to-[#0ea5e9] bg-clip-text font-bold text-transparent">
                "React ljbjdksbmno;klbadjlkhnasj;lkn"
              </span>
            </p>
            <p>2 min ago</p>
          </div>
          <div className="before-animate-opacity flex flex-col">
            <p>
              new comment on
              <span className="bg-linear-to-r from-[#3b82f6] to-[#0ea5e9] bg-clip-text font-bold text-transparent">
                "React ljbjdksbmno;klbadjlkhnasj;lkn"
              </span>
            </p>
            <p>2 min ago</p>
          </div>
          <div className="before-animate-opacity flex flex-col">
            <p>
              new comment on
              <span className="bg-linear-to-r from-[#3b82f6] to-[#0ea5e9] bg-clip-text font-bold text-transparent">
                "React ljbjdksbmno;klbadjlkhnasj;lkn"
              </span>
            </p>
            <p>2 min ago</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 p-4 max-md:gap-3 max-md:p-2">
          <Link
            to="/notifications"
            className="cursor-pointer text-[14px] font-bold text-purple-400 capitalize max-md:text-[12px]"
          >
            view all notifications
          </Link>
          <button
            type="button"
            onClick={() => {
              setnotifyIsClicked(false);
            }}
            className="b-(--color-input) h-fit w-fit cursor-pointer rounded-2xl border-2 border-solid border-(--color-text-interactive) p-2 text-[13px] capitalize hover:bg-(--color-ring) hover:text-black max-md:text-[11px]"
          >
            back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
