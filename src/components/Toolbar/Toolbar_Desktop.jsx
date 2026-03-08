import { ICONS } from "../../Constants/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useToolbar } from "../../hooks/useToolbar";
import UploadItems from "../UploadItems/UploadItems";
function Toolbar_Dekstop({ editor }) {
  const { state, actions } = useToolbar(editor);

  if (!editor) return null;

  const btn = (active) =>
    `rounded-lg p-2 transition ${
      active ? "bg-blue-600 text-white" : "hover:bg-amber-300 hover:text-black"
    }`;
  return (
    <div>
      <div className="border-b-2 border-solid border-b-(--color-border) p-2">
        <h1 className="p-2 text-2xl capitalize max-xl:text-xl 2xl:text-3xl">
          formatting
        </h1>
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <div className="mb-4 flex flex-col justify-between gap-6 border-b-2 border-solid border-b-(--color-border) p-8">
          <h2 className="p-1 text-lg capitalize max-xl:text-[16px] 2xl:text-xl">
            text style
          </h2>
          <div className="flex justify-center">
            <select
              title="format"
              className="w-full rounded-xl border-2 border-solid border-(--color-border) bg-(--color-input) p-1.5 2xl:p-3"
              onChange={(e) => actions.heading(e.target.value)}
            >
              <option name="paragraph" value="p">
                Paragraph
              </option>
              <option name="Heading1" value="1">
                H1
              </option>
              <option name="Heading2" value="2">
                H2
              </option>
              <option name="Heading3" value="3">
                H3
              </option>
            </select>
          </div>
        </div>
        {/* Paragraph / Format */}
        <div className="mb-4 flex flex-col justify-between gap-6">
          <h2 className="p-1 text-lg capitalize max-xl:text-[16px] 2xl:text-xl">
            format
          </h2>
          <div
            className={`flex items-center justify-between gap-2 p-3 *:cursor-pointer *:rounded-[10px] *:border-2 *:border-none *:p-2 *:text-lg *:hover:bg-amber-300 *:hover:text-black *:max-xl:text-[16px] *:2xl:text-xl`}
          >
            <button onClick={actions.bold} className={btn(state.bold)}>
              <FontAwesomeIcon icon={ICONS.bold} />
            </button>
            <button onClick={actions.italic} className={btn(state.italic)}>
              <FontAwesomeIcon icon={ICONS.italic} />
            </button>
            <button
              onClick={actions.underline}
              className={btn(state.underline)}
            >
              <FontAwesomeIcon icon={ICONS.underline} />
            </button>
            <button onClick={actions.strike} className={btn(state.strike)}>
              <FontAwesomeIcon icon={ICONS.strickThrough} />
            </button>
          </div>
        </div>

        {/* Alignment */}
        <div className="mb-4 flex flex-col justify-between gap-6">
          <h2 className="p-1 text-lg capitalize max-xl:text-[16px] 2xl:text-xl">
            alignment
          </h2>
          <div className="flex items-center justify-between gap-2 p-3 *:cursor-pointer *:text-lg *:max-xl:text-[16px] *:2xl:text-xl">
            <button
              onClick={actions.alignLeft}
              className={btn(state.alignLeft)}
            >
              <FontAwesomeIcon icon={ICONS.alignLeft} />
            </button>
            <button
              onClick={actions.alignCenter}
              className={btn(state.alignCenter)}
            >
              <FontAwesomeIcon icon={ICONS.alignCenter} />
            </button>
            <button
              onClick={actions.alignRight}
              className={btn(state.alignRight)}
            >
              <FontAwesomeIcon icon={ICONS.alignRight} />
            </button>
          </div>
        </div>

        {/* Lists */}
        <div className="mb-4 flex flex-col justify-between gap-2">
          <h2 className="p-1 text-lg capitalize max-xl:text-[16px] 2xl:text-xl">
            list
          </h2>
          <div className="flex items-center justify-center gap-2 p-3 *:cursor-pointer *:text-lg *:max-xl:text-[16px] *:2xl:text-xl">
            <button onClick={actions.bullet} className={btn(state.bulletList)}>
              <FontAwesomeIcon icon={ICONS.ulList} />
            </button>
            <button
              onClick={actions.ordered}
              className={btn(state.orderedList)}
            >
              <FontAwesomeIcon icon={ICONS.olList} />
            </button>
          </div>
        </div>

        {/* Insert */}
        <div className="flex-col justify-between gap-2">
          <h2 className="p-1 text-lg capitalize max-xl:text-[16px] 2xl:text-xl">
            insert
          </h2>
          <div className="flex flex-col justify-between gap-0.5">
            <div>
              <UploadItems />
            </div>
            <div className="m-1 flex p-2 *:flex *:w-full *:cursor-pointer *:items-center *:justify-center *:rounded-[10px] *:border-2 *:border-solid *:border-(--color-border) *:p-2 *:hover:border-none *:hover:bg-amber-400 *:hover:text-black *:max-xl:text-[14px] *:xl:text-[16px] *:2xl:text-xl">
              <button onClick={actions.code}>
                <FontAwesomeIcon icon={ICONS.code2} className="mr-2" />
                Code
              </button>
            </div>
          </div>
        </div>

        {/* Text Color */}
        <div className="my-6 flex items-center gap-6">
          <h2 className="p-1 text-lg capitalize max-xl:text-[16px] 2xl:text-xl">
            color
          </h2>
          <input
            type="color"
            placeholder="o"
            className="h-10 w-10 *:max-xl:h-8 *:max-xl:w-8"
            onChange={(e) => actions.color(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Toolbar_Dekstop;
