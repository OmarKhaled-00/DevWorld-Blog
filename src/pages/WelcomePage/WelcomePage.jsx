import React, { useState } from "react";
import WelcomeHeader from "../../components/Header/WelcomeHeader/WelcomeHeader";
import Register from "../../components/Register/Register";
import WPage_Services from "../../components/WPage_Services/WPage_Services";
import Footer from "../../components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
function WelcomePage() {
  const [whichBtn, setWhichBtn] = useState("");
  return (
    <div className="flex min-h-dvh flex-col">
      <WelcomeHeader whichBtn={whichBtn} setWhichBtn={setWhichBtn} />
      <div
        className={`container m-auto flex items-center justify-between gap-5 p-3`}
      >
        <div
          className={`animate__animated animate__fadeInLeft container-info ${whichBtn !== "" ? "max-md:hidden" : "max-md:block"} `}
        >
          <div className="flex flex-col justify-center gap-2.5">
            <div className="flex flex-col items-center justify-between gap-2">
              <h1 className="font-bold max-md:text-xl md:text-2xl 2xl:text-4xl">
                Welcome to the Future of
              </h1>
              <h2 className="bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text font-bold text-transparent max-lg:text-lg lg:text-xl 2xl:text-2xl">
                Developer Blogging
              </h2>
              <p className="bg-linear-to-r from-[#8b5cf6] to-[#ec4899] bg-clip-text text-center text-transparent">
                Join thousands of developers sharing knowledge, building
                connections, and growing together
              </p>
            </div>

            <div className="container flex flex-col justify-center gap-2.5 max-md:m-1.5 md:ml-2.5">
              <div className="feature flex flex-col justify-between gap-1 rounded-2xl border-2 border-solid border-(--color-cyan) bg-(--color-input) p-2 max-md:text-center">
                <h2 className="mr-2.5 max-md:text-lg md:text-xl 2xl:text-2xl">
                  <FontAwesomeIcon
                    icon={ICONS.OpenBook}
                    className="mr-2 text-emerald-500"
                  />
                  Share your knowledge
                </h2>
                <p className="text-xs text-gray-400">
                  Write and publish your own blog posts about software and
                  technology
                </p>
              </div>

              <div className="feature flex flex-col justify-between gap-1 rounded-2xl border-2 border-solid border-(--color-cyan) bg-(--color-input) p-2 max-md:text-center">
                <h2 className="max-md:text-lg md:text-xl 2xl:text-2xl">
                  <FontAwesomeIcon
                    icon={ICONS.users}
                    className="mr-2 text-emerald-500"
                  />
                  Connect with developers
                </h2>
                <p className="text-xs text-gray-400">
                  Read, comment, and interact with a global community of coders
                </p>
              </div>

              <div className="feature flex flex-col justify-between gap-1 rounded-2xl border-2 border-solid border-(--color-cyan) bg-(--color-input) p-2 max-md:text-center">
                <h2 className="max-md:text-lg md:text-xl 2xl:text-2xl">
                  <FontAwesomeIcon
                    icon={ICONS.ArrowUpRight}
                    className="mr-2 text-emerald-500"
                  />
                  Learn and grow
                </h2>
                <p className="text-xs text-gray-400">
                  Access tutorials, tips, and insights to improve your
                  programming skills
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${whichBtn === "" ? "max-md:hidden" : "max-md:block"} xl:block`}
        >
          <Register whichBtn={whichBtn || ""} />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-[90px] font-bold text-[#797979] capitalize max-md:text-[60px] 2xl:text-[100px]">
          services
        </h3>
      </div>
      <WPage_Services />
      <Footer />
    </div>
  );
}

export default WelcomePage;
