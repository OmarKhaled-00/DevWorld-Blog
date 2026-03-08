import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";

function TrendSection() {
  return (
    <section className="animate__animated animate__backInLeft group flex w-full flex-col justify-between gap-2 rounded-[15px] border-2 border-solid border-(--color-border) bg-(--color-input) p-5">
      <div className="flex items-center justify-between">
        <p className="m-3 h-fit w-fit rounded-[10px] border-2 border-transparent bg-(--color-primary) p-1 text-[12px] max-md:text-[10px]">
          Technology
        </p>
        <div className="hidden items-center justify-between gap-2 *:cursor-pointer *:rounded-[50%] *:border-2 *:border-solid *:border-(--color-border) *:bg-(--color-input) *:p-1 *:text-white group-hover:flex *:hover:bg-(--color-text-interactive) *:hover:text-black">
          <button className="">
            <FontAwesomeIcon icon={ICONS.bookMark} />
          </button>
          <button>
            <FontAwesomeIcon icon={ICONS.share} />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2">
        <h1
          role="title"
          className="text-4xl font-bold capitalize hover:text-(--color-primary) max-md:text-2xl"
        >
          the future of web development: trends to watch in 2025
        </h1>
        <h2 role="discribtion" className="capitalize max-md:text-[12px]">
          explore the cutting-edge technologies and methodologies that will
          shape the web development in the coming year , from AI integeration to
          sustainable coding practices .
        </h2>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img src="#" alt="" className="h-10 w-10 rounded-[50%] border-2" />
          <div className="flex flex-col gap-1 *:text-[14px] *:max-md:text-[12px]">
            <p>Omar Khaled</p>
            <p>Jan 8, 2025</p>
          </div>
          <p className="text-[14px] text-(--color-primary) max-md:text-[12px]">
            15 min
          </p>
        </div>
        <div className="mr-8 flex items-center gap-2 *:text-(--color-success)">
          <FontAwesomeIcon icon={ICONS.trend} />
          <span> + 135</span>
        </div>
      </div>
    </section>
  );
}

export default TrendSection;
