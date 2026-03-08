import { EditorContent } from "@tiptap/react";
import Toolbar_Desktop from "../Toolbar/Toolbar_Desktop";
import setState from "../../utils/setState";
import { ICONS } from "../../Constants/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRichEditor } from "../../hooks/useRichEditor";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { calculateReadingTime } from "../../utils/calculateReadingTime";
import { useAuth } from "../../hooks/useAuth";
import { CreatePost } from "../../services/postApi.services";
import { uploadFilesAPI } from "../../services/upload.services";
import { saveTages } from "../../services/tagsApi.services";
import { uploadStore } from "../../store/uploadStore";
import Loader from "../Loader/Loader";

function RichEditor() {
  const { user } = useAuth();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [title, setTitle] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [loadingDraftText, setLoadingDraftText] = useState("");
  const setPostId = uploadStore((state) => state.setPostId);
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
    handleStatusChange,
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
    // Handle the form submission logic here
    setState(setBtnDisabled, true);
    event.preventDefault();
    if (!editor) return;
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

      if (result.success) {
        setPostId(result.post.id);

        setLoadingText("Uploading files...");
        await uploadFilesAPI(result.post.id);

        if (selectedTags.length > 0) {
          setLoadingText("Saving tags...");
          await saveTages(result.post.id, selectedTags);
        }

        alert(result.message);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoadingText("");
      setBtnDisabled(false);
      navigate("/home");
    }
  }

  async function handleSaveAsDraft(event) {
    setState(setBtnDisabled, true);
    event.preventDefault();
    if (!editor) return;
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

      if (result.success) {
        setPostId(result.post.id);

        setLoadingDraftText("Uploading files...");
        await uploadFilesAPI(result.post.id);

        if (selectedTags.length > 0) {
          setLoadingDraftText("Saving tags...");
          await saveTages(result.post.id, selectedTags);
        }

        alert(result.message);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
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
    <div className="grid h-dvh grid-cols-[0.8fr_2.7fr_0.8fr] bg-(--color-input)">
      <div className="max-h-[90dvh] overflow-y-scroll border-r-2 border-solid border-r-(--color-border)">
        {editor && <Toolbar_Desktop editor={editor} />}
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between">
          <form className="flex-1 p-5">
            <input
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-[10px] border-2 border-solid border-(--color-border) p-2.5 2xl:p-5"
              type="text"
              name="postTitle"
              value={title}
              placeholder="Enter Post Title"
            />
          </form>
          <div className="mr-2.5 flex flex-1 items-center justify-between gap-10">
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
        <EditorContent
          editor={editor}
          className="bg-[#161616] p-3 [&_.ProseMirror]:h-[70dvh] [&_.ProseMirror]:max-h-[80dvh] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:wrap-break-word [&_.ProseMirror]:whitespace-pre-wrap [&_.ProseMirror]:text-white [&_.ProseMirror]:outline-none [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:text-base [&_ul]:ml-6 [&_ul]:list-disc"
        />
      </div>
      <div className="max-h-[90dvh] overflow-y-auto border-b-2 border-l-2 border-solid border-b-(--color-border) border-l-(--color-border)">
        <div className="border-b-2 border-solid border-b-(--color-border) p-2">
          <h3 className="p-2 text-2xl capitalize max-xl:text-xl 2xl:text-4xl">
            Post Settings
          </h3>
        </div>

        <div className="flex h-fit flex-col items-center justify-between gap-3 border-b-2 border-solid border-b-(--color-border) p-2 *:flex *:w-full *:cursor-pointer *:items-center *:justify-center *:gap-3 *:rounded-[10px] *:border-2 *:border-solid *:border-(--color-border) *:p-1.5 *:capitalize *:hover:border-none *:hover:bg-amber-400 *:hover:text-black *:max-xl:text-[16px] *:xl:text-lg *:2xl:p-3 *:2xl:text-xl">
          <button
            className="bg-(--color-primary)"
            disabled={btnDisabled}
            onClick={handleSubmit}
          >
            <FontAwesomeIcon icon={ICONS.publish} />
            {loadingText || "publish"}
          </button>
          <button onClick={handleSaveAsDraft} disabled={btnDisabled}>
            <FontAwesomeIcon icon={ICONS.saveDraft} />
            {loadingDraftText || "save as draft"}
          </button>
          {(loadingText || loadingDraftText) && <Loader />}
        </div>
        <div className="m-5 flex flex-col gap-10 *:capitalize">
          <p className="text-lg max-xl:text-[16px] 2xl:text-xl">visibility</p>
          <select
            name="Visibility"
            id="Visibility"
            onChange={handleStatusChange}
            className="w-full rounded-xl border-2 border-solid border-(--color-border) bg-(--color-input) p-1.5 2xl:p-3"
          >
            <option name="public" value="public">
              public
            </option>
            <option name="followers" value="followers">
              followers
            </option>
          </select>
        </div>
        <div className="m-5 flex flex-col gap-10 *:capitalize">
          <p className="text-lg max-xl:text-[16px] 2xl:text-xl">tags</p>
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
                className={`${selectedTags.includes(option) ? "bg-amber-400 text-black" : "bg-transparent text-white"} w-[50%] cursor-pointer rounded-[10px] border-2 border-solid border-(--color-border) p-2 text-center hover:border-transparent hover:bg-(--color-primary) max-2xl:w-fit`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="m-5 flex flex-col gap-3 *:capitalize">
          <p className="text-lg max-xl:text-[16px] 2xl:text-xl">
            Insert custom tag
          </p>
          <form
            onSubmit={handleCustomTag}
            className="flex justify-between gap-2 max-2xl:flex-col"
          >
            <input
              type="text"
              name="custom"
              value={customTag}
              onChange={(event) => {
                event.preventDefault();
                const Ctag = event.target.value;
                setState(setCustomTag, Ctag);
              }}
              placeholder="custom tag"
              className="rounded-[10px] border-2 border-solid border-(--color-border) p-1"
            />
            <button
              type="submit"
              disabled={!customTag}
              className="cursor-pointer rounded-[10px] border-2 border-solid border-(--color-border) bg-(--color-primary) p-1 capitalize hover:bg-(--color-border)"
            >
              add
            </button>
          </form>
        </div>
        <div className="m-5 flex flex-col gap-3 *:capitalize">
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
      </div>
    </div>
  );
}
export default RichEditor;
// export { content_json };
