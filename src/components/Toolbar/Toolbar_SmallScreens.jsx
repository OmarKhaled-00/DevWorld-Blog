import { useToolbar } from "../../hooks/useToolbar";
import { ICONS } from "../../Constants/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Toolbar_SmallScreens({ editor }) {
  const { state, actions } = useToolbar(editor);

  if (!editor) return null;

  const btn = (active) =>
    `rounded-[5px] p-0.5 transition ${
      active
        ? "border-b-blue-600 border-b-2 text-white"
        : "hover:border-b-blue-700 border-b-2 hover:text-blue-700"
    }`;
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 border-b-2 border-solid border-b-(--color-border) p-3">
        <select
          title="format"
          className="h-fit w-fit rounded-xl border-2 border-solid border-(--color-border) bg-(--color-input)"
          onChange={(e) => actions.heading(e.target.value)}
        >
          <option name="paragraph" value="p">
            p
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
        <div
          className={`flex flex-1 items-center justify-around *:cursor-pointer *:p-0.5 *:text-[12px] *:sm:text-[14px]`}
        >
          <button
            onClick={actions.bold}
            className={btn(state.bold)}
            title="bold"
          >
            <FontAwesomeIcon icon={ICONS.bold} />
          </button>
          <button
            onClick={actions.italic}
            className={btn(state.italic)}
            title="italic"
          >
            <FontAwesomeIcon icon={ICONS.italic} />
          </button>
          <button
            onClick={actions.underline}
            className={btn(state.underline)}
            title="underline"
          >
            <FontAwesomeIcon icon={ICONS.underline} />
          </button>
          <button
            onClick={actions.strike}
            className={btn(state.strike)}
            title="strike"
          >
            <FontAwesomeIcon icon={ICONS.strickThrough} />
          </button>
          <button
            onClick={actions.alignLeft}
            className={btn(state.alignLeft)}
            title="left-align"
          >
            <FontAwesomeIcon icon={ICONS.alignLeft} />
          </button>
          <button
            onClick={actions.alignCenter}
            className={btn(state.alignCenter)}
            title="center-align"
          >
            <FontAwesomeIcon icon={ICONS.alignCenter} />
          </button>
          <button
            onClick={actions.alignRight}
            className={btn(state.alignRight)}
            title="right-align"
          >
            <FontAwesomeIcon icon={ICONS.alignRight} />
          </button>
          <button
            onClick={actions.bullet}
            className={btn(state.bulletList)}
            title="ul-list"
          >
            <FontAwesomeIcon icon={ICONS.ulList} />
          </button>
          <button
            onClick={actions.ordered}
            className={btn(state.orderedList)}
            title="ol-list"
          >
            <FontAwesomeIcon icon={ICONS.olList} />
          </button>

          <button onClick={actions.code} title="insert code">
            <FontAwesomeIcon icon={ICONS.code2} />
          </button>
          <input
            type="color"
            className="h-5 w-5"
            onChange={(e) => actions.color(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Toolbar_SmallScreens;
