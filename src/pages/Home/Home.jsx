import { useState } from "react";
// import axios from "axios";
import { ENV } from "../../config/ENV";

import React, { Suspense } from "react";
import HomeHeader from "../../components/Header/HomeHeader/HomeHeader";
import HomeFooter from "../../components/Header/HomeFooter/HomeFooter";
import TrendSection from "./TrendSection";
import Loader from "../../components/Loader/Loader.jsx";
const PostList_Section = React.lazy(() => import("./PostList_Section.jsx"));
const SideBar_Section = React.lazy(() => import("./SideBar_Section"));
import { ICONS } from "../../Constants/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeroTitle from "../../components/HeroTitle/HeroTitle";
import setState from "../../utils/setState";
// import Post from "../Post/Post.jsx";
function Home() {
  const [isVisiable, setIsVisiable] = useState(false);

  // const navigate = useNavigate();
  // const [user, setUser] = useState(null);

  // async function getData() {

  // }
  // useEffect(() => {
  //   try {
  //     axios
  //       .get(`${ENV.BASE_URL}/auth/me`, { withCredentials: true })
  //       .then((res) => {
  //         if (res.data.success) {
  //           setUser(res.data.user);
  //         } else {
  //           navigate("/");
  //         }
  //       })
  //       .catch(() => {
  //         navigate("/");
  //       });
  //   } catch {
  //     return navigate("/");
  //   }
  // }, []);
  // console.log(user);

  return (
    <div className="relative min-h-dvh">
      <HomeHeader />
      <main className="m-auto grid grid-cols-[3fr_0.8fr] gap-5 p-2.5 max-lg:grid-cols-1">
        <section className="flex flex-col justify-between gap-3">
          <TrendSection />
          <HeroTitle title={"articles"} />
          <Suspense fallback={<Loader />}>
            <PostList_Section />
          </Suspense>
        </section>
        <div className="animate__animated animate__backInRight max-lg:hidden">
          <Suspense fallback={<div>Loading...</div>}>
            <SideBar_Section />
          </Suspense>
        </div>
      </main>
      <div
        className={`animate__animated animate__backInLeft fixed top-[33%] right-10 opacity-90 lg:hidden ${isVisiable ? "block" : "hidden"}`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SideBar_Section />
        </Suspense>
      </div>
      <button
        onClick={() => {
          setState(setIsVisiable, !isVisiable);
        }}
        className="group fixed top-[50%] right-0 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-[50%] border-2 border-solid border-(--color-ring) bg-(--color-input) opacity-[0.8] hover:bg-(--color-text-interactive) lg:hidden"
      >
        <FontAwesomeIcon
          className="text-xl text-white/50 group-hover:text-black"
          icon={isVisiable ? ICONS.rightArrow : ICONS.leftArrow}
        />
      </button>
      <HomeFooter />
    </div>
  );
}

export default Home;
