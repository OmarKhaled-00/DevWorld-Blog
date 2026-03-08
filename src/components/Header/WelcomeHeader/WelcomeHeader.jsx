import { useState, useEffect } from "react";
import handleScroll from "../../../utils/handleScroll";
import setState from "../../../utils/setState";

function WelcomeHeader({ whichBtn, setWhichBtn }) {
  const [isDefault, setIsDefault] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    handleScroll(setIsHidden, setIsDefault);
  }, []);

  useEffect(() => {
    if (!isHidden) {
      setState(setShouldRender, true);
    }
  }, [isHidden]);

  function handleOnClick(event) {
    event.preventDefault();
    const result = event.target.name;
    setWhichBtn(result);
  }

  if (!shouldRender) return null;

  return (
    <div>
      <header
        onAnimationEnd={() => {
          if (isHidden) {
            setState(setShouldRender, true);
          }
        }}
        className={`animate__animated ${isHidden ? " animate__fadeOutUp" : "animate__fadeInDown"} ${isDefault ? "relative" : "fixed top-0 left-0 z-1000"} flex w-full items-center justify-between border-b-2 border-solid border-b-(--color-cyan) bg-(--color-input) p-1`}
      >
        {/* Logo */}
        <div className="logo m-3 flex gap-1">
          <a href="/" className="group flex items-center">
            <h1 className="bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text pr-2.5 font-bold text-transparent transition-all duration-500 group-hover:from-[#8b5cf6] group-hover:to-[#ec4899] max-md:text-xl md:text-3xl">
              DevWorld Blog
            </h1>

            <div>
              <img
                src="./dev.jpg"
                alt="logo"
                className="h-8 w-8 transition-transform duration-500 group-hover:rotate-y-360"
              />
            </div>
          </a>
        </div>

        {/* Auth Buttons */}

        <div className="flex gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-tr-xl rounded-bl-xl border-2 border-solid border-(--color-ring) bg-(--color-input) capitalize hover:bg-(--color-text-interactive) hover:text-black max-md:p-1 max-md:text-[12px] md:p-3"
            name="login"
            value={whichBtn}
            onClick={handleOnClick}
          >
            login
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-tl-xl rounded-br-xl border-2 border-solid border-(--color-ring) bg-(--color-input) p-3 capitalize hover:bg-(--color-text-interactive) hover:text-black max-2xl:p-3 max-md:p-1 max-md:text-[12px]"
            name="signUp"
            value={whichBtn}
            onClick={handleOnClick}
          >
            sign up
          </button>
        </div>
      </header>
    </div>
  );
}

export default WelcomeHeader;
