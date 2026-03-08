import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import SearchBar from "../../SearchBar/SearchBar";
import Notification from "../../Notification/Notification";
import Profile from "../../Profile/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../../Constants/Icons/Icons";
import handleScroll from "../../../utils/handleScroll";
import setState from "../../../utils/setState";
function HomeHeader() {
  const navLinkClass = ({ isActive }) =>
    isActive ? "text-[#3b82f6] hover:text-black font-bold" : "";

  const [isDefault, setIsDefault] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    handleScroll(setIsHidden, setIsDefault);
  }, [isHidden]);

  useEffect(() => {
    if (!isHidden) {
      setState(setShouldRender, true);
    }
  }, [isHidden]);

  if (!shouldRender) return null;

  return (
    <div>
      <header
        onAnimationEnd={() => {
          if (isHidden) {
            setState(setShouldRender, false);
          }
        }}
        className={`animate__animated z-1000 flex w-full items-center justify-between border-b-2 border-solid border-b-(--color-border) bg-(--color-input) p-1 ${isHidden ? " animate__fadeOutUp" : "animate__fadeInDown"} ${isDefault ? "relative" : "fixed top-0 left-0 z-1000"} `}
      >
        <div className="logo m-3 flex items-center justify-between gap-2">
          <a href="/home" className="group flex items-center">
            <h1 className="bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text pr-2.5 font-bold text-transparent transition-all duration-500 group-hover:from-[#8b5cf6] group-hover:to-[#ec4899] max-md:text-lg md:text-2xl lg:text-3xl xl:text-4xl">
              DevWorld Blog
            </h1>

            <div>
              <img
                src="./dev.jpg"
                alt="logo"
                className="h-8 w-8 transition-transform duration-500 group-hover:rotate-y-360 max-md:h-5 max-md:w-5"
              />
            </div>
          </a>
          <div className="flex items-center justify-between gap-2 p-1 *:cursor-pointer *:rounded-2xl *:border-2 *:border-solid *:border-(--color-border) *:bg-(--color-input) *:p-2 *:hover:bg-(--color-text-interactive) *:hover:text-black *:max-xl:flex-col *:max-xl:text-[15px] max-lg:hidden *:xl:text-[18px] *:2xl:p-3 *:2xl:text-[22px]">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={ICONS.Home} />
              <NavLink className={navLinkClass} to="/home">
                Home
              </NavLink>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={ICONS.searchengin} />
              <NavLink className={navLinkClass} to="/advancedSearch">
                Search
              </NavLink>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={ICONS.Plus} />
              <NavLink className={navLinkClass} to="/create">
                Create
              </NavLink>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={ICONS.users} />
              <NavLink className={navLinkClass} to="/network">
                My Network
              </NavLink>
            </div>
          </div>
        </div>

        <div className="mr-2 flex items-center justify-end gap-2.5 max-md:gap-5">
          <SearchBar />
          <div className="flex items-center justify-between gap-2">
            <Notification />
            <Profile />
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomeHeader;
