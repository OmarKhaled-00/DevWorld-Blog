import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../../Constants/Icons/Icons";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import handleScroll from "../../../utils/handleScroll";
import setState from "../../../utils/setState";
function HomeFooter() {
  const navLinkClass = ({ isActive }) =>
    isActive ? "text-[#3b82f6] hover:text-black font-bold" : "";

  const [isHidden, setIsHidden] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    handleScroll(setIsHidden);
  }, [isHidden]);

  useEffect(() => {
    if (!isHidden) {
      setState(setShouldRender, true);
    }
  }, [isHidden]);

  if (!shouldRender) return null;

  return (
    <div
      onAnimationEnd={() => {
        if (isHidden) {
          setState(setShouldRender, false);
        }
      }}
      className={`animate__animated fixed bottom-0 flex ${isHidden ? "animate__fadeOutDown " : "animate__fadeInUp "} w-full items-center justify-evenly gap-2 border-t-2 border-solid border-t-(--color-cyan) bg-(--color-input) p-1 *:cursor-pointer *:rounded-2xl *:border-2 *:border-solid *:border-(--color-border) *:bg-(--color-input) *:p-1.5 *:text-[14px] *:hover:bg-(--color-text-interactive) *:hover:text-black *:max-md:p-1 *:max-md:text-[12px] lg:hidden`}
    >
      <div className="flex items-center gap-0.5">
        <FontAwesomeIcon icon={ICONS.Home} />
        <NavLink className={navLinkClass} to="/home">
          Home
        </NavLink>
      </div>
      <div className="flex items-center gap-0.5">
        <FontAwesomeIcon icon={ICONS.searchengin} />
        <NavLink className={navLinkClass} to="/advancedSearch">
          Search
        </NavLink>
      </div>
      <div className="flex items-center gap-0.5">
        <FontAwesomeIcon icon={ICONS.Plus} />
        <NavLink className={navLinkClass} to="/create">
          Create
        </NavLink>
      </div>
      <div className="flex items-center gap-0.5">
        <FontAwesomeIcon icon={ICONS.users} />
        <NavLink className={navLinkClass} to="/network">
          My Network
        </NavLink>
      </div>
    </div>
  );
}

export default HomeFooter;
