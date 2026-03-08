import { useRichEditor } from "../../hooks/useRichEditor";
import { EditorContent } from "@tiptap/react";
import { ICONS } from "../../Constants/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toolbar_SmallScreens from "../Toolbar/Toolbar_SmallScreens";
import setState from "../../utils/setState";
import UploadItems from "../UploadItems/UploadItems";
import { useState, useEffect } from "react";
import { calculateReadingTime } from "../../utils/calculateReadingTime";
import { useAuth } from "../../hooks/useAuth";
import { CreatePost } from "../../services/postApi.services";
import { uploadFilesAPI } from "../../services/upload.services";
import { saveTages } from "../../services/tagsApi.services";
import { uploadStore } from "../../store/uploadStore";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
function RichEditor_SmallScreens() {
  const { user } = useAuth();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [title, setTitle] = useState("");
  const setPostId = uploadStore((state) => state.setPostId);
  const [loadingText, setLoadingText] = useState("");
  const [loadingDraftText, setLoadingDraftText] = useState("");
  const navigate = useNavigate();
  const {
    editor,
    selectedTags,
    setSelectedTags,
    customTag,
    setCustomTag,
    MAX_CHARS,
    status,
    toggleOption,
    handleCustomTag,
    suggestedTags,
  } = useRichEditor({
    initialContent: "<h1>Edit mode</h1><p>Loaded from DB</p>",
    autoFocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const chars = text.length;
      setState(setCharCount, chars);
      if (chars > MAX_CHARS) {
        editor.commands.undo();
        return;
      }
      setReadingTime(calculateReadingTime(text));
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!editor) return;

    setBtnDisabled(true);

    try {
      setLoadingText("Creating post...");

      const payload = {
        user_id: user.id,
        content_json: editor.getJSON(),
        content_text: editor.getText(),
        visibility: status ? status : "public",
        status: "active",
        title: title,
      };

      const result = await CreatePost(payload);

      if (!result.success) {
        throw new Error("Failed to create post");
      }

      setLoadingText("Uploading files...");
      await uploadFilesAPI(result.post.id);

      if (selectedTags.length > 0) {
        setLoadingText("Saving tags...");
        await saveTages(result.post.id, selectedTags);
      }

      alert(result.message);
      navigate("/home");
    } catch (error) {
      alert("Something went wrong, try again.");
    } finally {
      setLoadingText("");
      setBtnDisabled(false);
      navigate("/home");
    }
  }

  async function handleSaveAsDraft(event) {
    event.preventDefault();

    if (!editor) return;

    setBtnDisabled(true);

    try {
      setLoadingDraftText("Saving draft...");

      const payload = {
        user_id: user.id,
        content_json: editor.getJSON(),
        content_text: editor.getText(),
        visibility: status ? status : "public",
        status: "draft",
        title: title,
      };

      const result = await CreatePost(payload);

      if (!result.success) {
        throw new Error("Failed to create draft");
      }

      setPostId(result.post.id);

      setLoadingDraftText("Uploading data...");
      await uploadFilesAPI(result.post.id);

      if (selectedTags.length > 0) {
        setLoadingDraftText("Saving tags...");
        await saveTages(result.post.id, selectedTags);
      }

      alert(result.message);
      navigate("/home");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoadingDraftText("");
      setBtnDisabled(false);
      navigate("/home");
    }
  }

  useEffect(() => {
    console.log("Selected Tags:", selectedTags);
    console.log("status:", status);
  }, [selectedTags, status]);

  return (
    <div className="flex flex-col bg-(--color-input)">
      <div className="flex justify-around">
        <form action="" className="m-2 flex flex-col gap-1">
          <label className="text-xs capitalize">Enter Post Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-[10px] border-2 border-solid border-(--color-border) p-0.5 sm:p-1.5"
            type="text"
            name="postTitle"
          />
        </form>
        <div className="flex items-center justify-between gap-1 *:text-[12px]">
          <p>
            <span className="text-green-500">{charCount} </span>characters
          </p>
          <p>
            <span className="text-red-500">{MAX_CHARS - charCount}</span>{" "}
            characters left
          </p>
          <p>
            <span className="text-amber-300">{readingTime}</span> min Read
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse">
        <div>{editor && <Toolbar_SmallScreens editor={editor} />}</div>

        <EditorContent
          editor={editor}
          className="bg-[#161616] p-3 [&_.ProseMirror]:h-[70dvh] [&_.ProseMirror]:max-h-[80dvh] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:wrap-break-word [&_.ProseMirror]:whitespace-pre-wrap [&_.ProseMirror]:text-white [&_.ProseMirror]:outline-none [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:text-base [&_ul]:ml-6 [&_ul]:list-disc"
        />
      </div>

      <div className="border-b-2 border-l-2 border-solid border-b-(--color-border) border-l-(--color-border)">
        <div className="border-b-2 border-solid border-b-(--color-border) p-2">
          <h3 className="ma p-2 text-xl capitalize">Post Settings</h3>
        </div>

        <div className="m-3 flex h-fit flex-col items-start gap-2 *:capitalize">
          <p className="text-lg">Insert </p>
          <div>
            <UploadItems />
          </div>
        </div>

        <div className="m-3 flex flex-col gap-5 *:capitalize">
          <p className="text-lg">visibility</p>
          <select
            name="Visibility"
            id="Visibility"
            className="w-[80%] rounded-xl border-2 border-solid border-(--color-border) bg-(--color-input) p-1.5"
          >
            <option name="paragraph" value="public">
              public
            </option>
            <option name="private" value="private">
              followers
            </option>
          </select>
        </div>
        <div className="m-3 flex flex-col gap-10 *:capitalize">
          <p className="text-lg">tags</p>
          <div
            role="listbox"
            className="flex h-30 flex-col items-center gap-4 overflow-y-scroll rounded-[10px] border-2 border-solid border-(--color-border) p-2"
          >
            {suggestedTags.map((option) => (
              <div
                key={option}
                onClick={() => {
                  toggleOption(option);
                }}
                role="options"
                className={`${selectedTags.includes(option) ? "bg-amber-400 text-black" : "bg-transparent text-white"} w-[50%] cursor-pointer rounded-[10px] border-2 border-solid border-(--color-border) p-2 text-center hover:border-transparent hover:bg-(--color-primary)`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="m-3 flex flex-col gap-3 *:capitalize">
          <p className="text-lg">Insert custom tag</p>
          <form
            onSubmit={handleCustomTag}
            className="flex flex-col items-center justify-between gap-2"
          >
            <input
              type="text"
              name="custom"
              value={customTag.custom}
              onChange={(event) => {
                event.preventDefault();
                const Ctag = event.target.value;
                setState(setCustomTag, Ctag);
              }}
              placeholder="custom tag"
              className="w-[80%] rounded-[10px] border-2 border-solid border-(--color-border) p-1"
            />
            <button
              type="submit"
              disabled={!customTag}
              className="w-[50%] cursor-pointer rounded-[10px] border-2 border-solid border-(--color-border) bg-(--color-primary) p-0.5 capitalize hover:bg-(--color-border) hover:text-black"
            >
              add
            </button>
          </form>
        </div>
        <div className="m-3 flex flex-col gap-3 *:capitalize">
          <p className="text-lg max-xl:text-[16px] 2xl:text-xl">
            selected tags
          </p>
          <div className="m-5 flex h-30 flex-wrap justify-between gap-5 overflow-y-scroll rounded-[10px] border-2 border-solid border-(--color-border) p-2 max-2xl:flex-col max-2xl:flex-nowrap max-2xl:items-center max-xl:m-2 max-xl:overflow-x-hidden">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                onClick={() => {
                  setSelectedTags(selectedTags.filter((item) => item !== tag));
                }}
                className="h-fit cursor-pointer rounded-[10px] border-2 border-none bg-(--color-success) p-2 text-black"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-fit flex-col items-center justify-between gap-3 border-b-2 border-solid border-b-(--color-border) p-2 *:flex *:w-full *:cursor-pointer *:items-center *:justify-center *:gap-3 *:rounded-[10px] *:border-2 *:border-solid *:border-(--color-border) *:p-1.5 *:text-[16px] *:capitalize *:hover:border-none *:hover:bg-amber-400 *:hover:text-black">
          <button
            className={`${loadingText ? "bg-(--color-success)" : "bg-(--color-primary)"}`}
            onClick={handleSubmit}
            disabled={btnDisabled}
          >
            <FontAwesomeIcon icon={ICONS.publish} />
            {loadingText || "publish"}
          </button>
          <button
            className={`${loadingDraftText ? "bg-(--color-success)" : "bg-(--color-primary)"}`}
            disabled={btnDisabled}
            onClick={handleSaveAsDraft}
          >
            <FontAwesomeIcon icon={ICONS.saveDraft} />
            {loadingDraftText || "save as draft"}
          </button>
        </div>
        {(loadingText || loadingDraftText) && <Loader />}
      </div>
    </div>
  );
}
export default RichEditor_SmallScreens;
