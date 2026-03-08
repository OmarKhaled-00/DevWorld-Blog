import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { useState } from "react";
// import axios from "axios";
import { ENV } from "../../config/ENV";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
function Profile() {
  // const navigate = useNavigate();
  const [isClicked, setISClicked] = useState(false);
  const { logout } = useAuth();

  async function handleLogOut() {
    // try {
    //   const res = await axios.post(
    //     `http://localhost:8888/logout`,
    //     {},
    //     {
    //       withCredentials: true,
    //     },
    //   );
    //   console.log(res);
    //   navigate("/", { replace: true });
    // } catch (err) {
    //   console.log(err);
    // }

    await logout();

    // navigate("/", { replace: true });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setISClicked(!isClicked);
        }}
        className="flex cursor-pointer items-center justify-center rounded-[50%] border-2 border-solid border-transparent bg-linear-to-r from-[#16a085] to-[#0ea5e9] hover:text-black max-md:h-6 max-md:w-6 md:h-8 md:w-8"
      >
        O
      </button>
      <div
        className={`${isClicked ? "block" : "hidden"} animate__animated animate__fadeInUp absolute top-12 -left-40 h-max w-max items-center rounded-[20px] border-2 border-solid border-transparent bg-(--color-input) opacity-[0.8] shadow-[0_0_10px_#00ffff,0_0_15px_#00ffff] max-md:-left-40`}
      >
        <div className="flex flex-col justify-between gap-1 border-b-2 border-b-(--color-border) p-2">
          <p className="max-md:text-[12px] md:text-xl">Omar Khaled</p>
          <small className="max-md:text-[10px] md:text-lg">
            ok8086143@gmail.com
          </small>
        </div>
        <div className="animate__animated animate__fadeInUp flex flex-col justify-between gap-2 pt-2 pb-2 *:pl-2 *:text-[18px] *:capitalize *:max-md:text-[11px]">
          <div className="flex items-center gap-2 hover:text-(--color-success)">
            <FontAwesomeIcon icon={ICONS.user} />
            <Link to="/profile">profile</Link>
          </div>
          <div className="flex items-center gap-2 hover:text-amber-300">
            <FontAwesomeIcon icon={ICONS.settings} />
            <Link to="/settings">settings</Link>
          </div>
          <div className="flex items-center gap-2 hover:text-red-500">
            <FontAwesomeIcon icon={ICONS.logOut} />
            <button onClick={handleLogOut} className="cursor-pointer">
              log out
            </button>
          </div>
        </div>
        <div className="flex justify-center border-t-2 border-t-(--color-border) p-1">
          <button
            type="button"
            onClick={() => {
              setISClicked(false);
            }}
            className="b-(--color-input) h-fit w-fit cursor-pointer rounded-2xl border-2 border-solid border-(--color-text-interactive) p-2 text-[16px] capitalize hover:bg-(--color-ring) hover:text-black max-md:p-1 max-md:text-[10px]"
          >
            back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
