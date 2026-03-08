import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";

function SideBar_Section() {
  return (
    <div>
      <aside className={`flex flex-col gap-2`}>
        <section className="flex flex-col items-center justify-between gap-2 rounded-[15px] border-2 border-solid border-(--color-border) bg-(--color-input) p-2">
          <h5 className="text-xl capitalize">Popular Tags</h5>
          <div className="grid grid-cols-2 gap-4 *:cursor-pointer *:hover:text-blue-700">
            <button>#Typescript</button>
            <button>#Typescript</button>
            <button>#Typescript</button>
            <button>#Typescript</button>
            <button>#Typescript</button>
          </div>
        </section>
        <section className="flex flex-col items-center justify-between gap-2 rounded-[15px] border-2 border-solid border-(--color-border) bg-(--color-input) p-2">
          <h4 className="text-xl capitalize">featured authors</h4>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center justify-evenly gap-2">
              <img src="#" alt="" className="h-10 w-10 rounded-[50%] border-2" />
              <div>
                <div className="flex flex-col justify-between gap-1 *:capitalize">
                  <p role="name">Alex chen</p>
                  <p>full stack development</p>
                </div>
                <div className="flex justify-between gap-1">
                  <div className="flex flex-col justify-between gap-1 *:text-[12px] *:capitalize">
                    <p>articles</p>
                    <small>18</small>
                  </div>
                  <div className="flex flex-col justify-between gap-1 *:text-[12px] *:capitalize">
                    <p>followers</p>
                    <small>200K</small>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            <a href="/" className="animate-arrowMove transition-all delay-75">
              <FontAwesomeIcon icon={ICONS.rightArrow} />
            </a>
          </div>
        </section>
      </aside>
    </div>
  );
}

export default SideBar_Section;
