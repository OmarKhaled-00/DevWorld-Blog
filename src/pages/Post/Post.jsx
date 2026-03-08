import { EditorContent } from "@tiptap/react";
import { useLocation } from "react-router-dom";
import { useRichEditor } from "../../hooks/useRichEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { useState } from "react";
import setState from "../../utils/setState";
import { CreateLikes } from "../../services/postApi.services";
import { FetchPost } from "../../services/postApi.services";
import { useAuth } from "../../hooks/useAuth";
import PostHeader from "./PostHeader";
export default function Post() {
  const { user } = useAuth();

  const [showMore, setShowMore] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [isReposted, setIsReposted] = useState(false);
  const [isTrended, setIsTrended] = useState(false);
  const [isReplayLiked, setIsReplayLiked] = useState(false);
  const [userWhoLikes, setUserWhoLikes] = useState(null);

  const [totalLikes, setTotalLikes] = useState(0);
  const { state } = useLocation();

  const { editor } = useRichEditor({
    initialContent: state?.content_json,
    autoFocus: false,
    editable: false,
  });

  // if (!state?.content_json) {
  //   return <p>No content to preview</p>;
  // }

  console.log(user.id);

  async function handleLikes() {
    const result = await FetchPost(user.id, state.content_text);
    const response = await CreateLikes(result.post_id[0].id, user.id);
    setTotalLikes(response.post_status.total_likes);
    setUserWhoLikes(
      response.post_status.users_id === null
        ? 0
        : Array.isArray(response.post_status.users_id)
          ? response.post_status.users_id[0]
          : response.post_status.users_id,
    );
  }

  function goBack() {
    window.history.back();
  }

  return (
    <section className="min-h-dvh bg-linear-to-b from-[#000000] to-[#151f38]">
      {/* Navigation */}
      <nav className="sticky top-0 w-fit pt-3 pl-3">
        <button
          onClick={goBack}
          className="flex w-fit cursor-pointer items-center rounded-[10px] border-2 border-solid border-(--color-border) p-2 capitalize hover:bg-(--color-border)"
        >
          <FontAwesomeIcon icon={ICONS.leftArrow} />
          go back
        </button>
      </nav>

      {/* Post container */}

      <article className="relative container m-auto mt-2 flex h-fit max-w-[50%] flex-col rounded-md border-2 border-solid border-(--color-border) bg-linear-to-t from-[#000000] to-[#151f38]">
        {/* Post header */}
        <article className="p-2">
          <PostHeader />

          {/* Post content */}
          <section className="mt-6 mb-6 flex flex-col">
            <p className="mb-5 text-center text-4xl uppercase underline">
              {state?.title}
            </p>
            <EditorContent
              editor={editor}
              className={`prose prose-invert max-w-none ${
                showMore
                  ? "[&_.ProseMirror]:h-fit [&_.ProseMirror]:overflow-y-hidden"
                  : "[&_.ProseMirror]:h-70 [&_.ProseMirror]:overflow-y-auto"
              } [&_.ProseMirror]:wrap-break-word [&_.ProseMirror]:whitespace-pre-wrap [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_ol]:ml-6 [&_ol]:list-decimal [&_ul]:ml-6 [&_ul]:list-disc`}
            />
            <button
              className={`cursor-pointer ${
                showMore
                  ? "text-red-600 hover:bg-red-600 hover:text-white"
                  : "text-blue-600 hover:bg-blue-600 hover:text-white"
              } m-1 w-fit rounded-[10px] border-2 border-solid border-(--color-border) p-1`}
              onClick={() => setState(setShowMore, !showMore)}
            >
              {showMore ? "show less" : "show more"}
            </button>
          </section>

          <div className="m-2 flex flex-wrap gap-2">
            {state?.tags.map((tag, index) => (
              <p className="text-blue-300 capitalize" key={index}>
                #{tag}
              </p>
            ))}
          </div>

          {/* Subscription image */}
          <aside>
            <figure>
              <img
                src="./subscribe.jpg"
                alt="Subscribe banner"
                className="rounded-[10px]"
              />
            </figure>
          </aside>

          {/* Engagement stats */}
          <footer className="my-2 flex justify-between">
            <div className={`flex items-center gap-1`}>
              <div className={`${totalLikes > 0 ? "block " : "hidden"}`}>
                <FontAwesomeIcon
                  icon={ICONS.like}
                  className="text-[18px] text-blue-600"
                />
              </div>
              <span>{totalLikes > 0 ? totalLikes : ""}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>2 comments</span>
              <span>3 repost</span>
              <FontAwesomeIcon
                icon={ICONS.trend}
                className="text-(--color-success)"
              />
            </div>
          </footer>

          {/* Actions */}
          <section className="flex items-center justify-between border-t-2 border-t-(--color-border) p-3 *:flex *:transform *:cursor-pointer *:flex-col *:items-center *:gap-0.5 *:capitalize *:transition-all *:duration-200 *:ease-in-out">
            <button
              onClick={() => {
                handleLikes();
              }}
              className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-solid hover:border-blue-600"
            >
              <FontAwesomeIcon
                icon={ICONS.like}
                className={`${user?.id == userWhoLikes ? "rounded-[50%] bg-blue-600 p-1 text-white/70" : "border-none bg-none "} text-[18px] text-blue-600`}
              />
              <p
                className={`${user?.id == userWhoLikes ? "text-blue-500" : "text-white"}`}
              >
                like
              </p>
            </button>

            <button
              onClick={() => {
                setState(setIsComment, !isComment);
                setState(setReplyTo, null);
              }}
              className={` ${
                isComment ? "rounded-[10px] bg-teal-600 text-white" : ""
              } border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-solid hover:border-teal-600`}
            >
              <FontAwesomeIcon
                icon={ICONS.comment}
                className={`text-[18px] ${isComment ? "text-white" : "text-teal-600"}`}
              />
              <p>comment</p>
            </button>

            <button
              onClick={() => setState(setIsReposted, !isReposted)}
              className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-solid hover:border-cyan-800"
            >
              <FontAwesomeIcon
                icon={ICONS.repost}
                className="text-[18px] text-cyan-800"
              />
              <p>repost</p>
            </button>

            <button
              onClick={() => setState(setIsTrended, !isTrended)}
              className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-solid hover:border-(--color-success)"
            >
              <FontAwesomeIcon
                icon={ICONS.trend}
                className={`${isTrended ? "rounded-[50%] bg-(--color-success) p-1 text-white/70" : "bg-none text-(--color-success)"} text-[18px]`}
              />
              <p
                className={`${isTrended ? " text-(--color-success)" : "text-white/70"} text-[18px]`}
              >
                trend
              </p>
            </button>
          </section>

          {/* Comments */}
          <section className="relative flex flex-col p-1">
            <h4 className="mb-2 p-2 capitalize">comments</h4>

            <article className="relative flex">
              <span className="absolute top-2 left-4 h-[calc(100%+1.8rem)] w-10 border-b-2 border-l-2 border-solid border-white/65"></span>

              <div className="flex flex-col">
                <header className="mb-6 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <img
                      src="./circle.png"
                      alt="Comment author"
                      className="h-8 w-8"
                    />
                    <div className="*:capitalize">
                      <p>ahmed hamdy</p>
                      <p className="text-[12px] text-white/70">
                        full stack web developer
                      </p>
                    </div>
                  </div>
                  <time className="text-white/60">2 min</time>
                </header>

                <div className="ml-10 flex flex-col gap-2">
                  <p>
                    This is sample comment This is sample comment This is sample
                    comment This is sample comment This is sample comment This
                    is sample comment This is sample comment This is sample
                    comment This is sample comment This is sample comment This
                    is sample comment This is sample comment This is sample
                    comment This is sample comment This is sample comment This
                    is sample comment This is sample comment This is sample
                    comment This is sample comment This is sample comment
                  </p>

                  <div className="ml-10 flex w-fit items-center gap-2 *:text-[12px] *:capitalize">
                    <button
                      onClick={() => setState(setIsReplayLiked, !isReplayLiked)}
                      className="cursor-pointer rounded-[10px] border-2 border-solid border-blue-700 p-1 hover:bg-blue-800"
                    >
                      like
                    </button>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon
                        icon={ICONS.like}
                        className={`ml-1 text-[14px] text-blue-600`}
                      />
                      <span>2</span>
                    </div>

                    <span className="mx-2 h-8 w-1 rounded-[10px] border-2 border-solid bg-white"></span>
                    <button
                      onClick={() => {
                        setState(setReplyTo, "ahmed Hamdy"); //later use id and fetch username
                        setState(setIsComment, false);
                      }}
                      className={`cursor-pointer rounded-[10px] border-2 border-solid border-violet-700 p-1 hover:bg-violet-700 ${replyTo !== null ? "rounded-[10px] bg-violet-700 text-white" : ""}`}
                    >
                      reply
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <div className="relative mt-4 ml-14 flex gap-2">
              {/* vertical line */}
              {/* <span className="absolute top-0 -left-6 h-full w-4 border-b-2 border-l border-solid border-white/65" /> */}

              <div className="flex flex-col gap-1 rounded-md border-2 border-solid border-(--color-border) p-2">
                <header className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex gap-1">
                    <img
                      src="./circle.png"
                      alt="Reply author"
                      className="h-7 w-7 rounded-full"
                    />
                    <div className="flex flex-col gap-0.5 *:capitalize">
                      <p className="capitalize">omar khaled</p>
                      <p className="text-[12px] text-white/70">
                        Full Stack Web Developer
                      </p>
                    </div>
                  </div>
                  <time className="text-xs text-white/60">now</time>
                </header>

                <p className="h-fit text-sm">
                  This is a reply content (UI only for now) This is a reply
                  content (UI only for now) This is a reply content (UI only for
                  now) This is a reply content (UI only for now) This is a reply
                  content (UI only for now) This is a reply content (UI only for
                  now) This is a reply content (UI only for now) This is a reply
                  content (UI only for now) This is a reply content (UI only for
                  now) This is a reply content (UI only for now) This is a reply
                  content (UI only for now)
                </p>
                <div className="ml-10 flex w-fit items-center gap-2 *:text-[12px] *:capitalize">
                  <button
                    onClick={() => setState(setIsReplayLiked, !isReplayLiked)}
                    className="cursor-pointer rounded-[10px] border-2 border-solid border-blue-700 p-1 hover:bg-blue-800"
                  >
                    like
                  </button>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={ICONS.like}
                      className={`ml-1 text-[14px] text-blue-600`}
                    />
                    <span>2</span>
                  </div>

                  <span className="mx-2 h-8 w-1 rounded-[10px] border-2 border-solid bg-white"></span>
                  <button
                    onClick={() => {
                      setState(setReplyTo, "ahmed Hamdy"); //later use id and fetch username
                      setState(setIsComment, false);
                    }}
                    className={`cursor-pointer rounded-[10px] border-2 border-solid border-violet-700 p-1 hover:bg-violet-700 ${replyTo !== null ? "rounded-[10px] bg-violet-700 text-white" : ""}`}
                  >
                    reply
                  </button>
                </div>
              </div>
            </div>
          </section>
        </article>
        <section
          className={` ${isComment || replyTo !== null ? "flex" : "hidden"} sticky bottom-0 flex w-full items-center gap-2 bg-linear-to-r from-[#000000] to-[#151f38] p-3`}
        >
          <aside>
            <a href="/profile" className="cursor-pointer">
              <img
                src="./subscribe.jpg"
                alt="Subscribe banner"
                className="h-10 w-10 rounded-full object-cover"
              />
            </a>
          </aside>
          <form className="relative flex flex-1 items-center gap-2" action="">
            <input
              className="sticky top-0 left-0 flex-1 rounded-[20px] border-2 border-solid border-(--color-border) p-2"
              type="text"
              placeholder={`${replyTo !== null ? "@Ahmed Hamdy" : "Write a comment..."}`}
            />
            <button className="cursor-pointer hover:text-(--color-success)">
              {replyTo !== null ? "Reply" : "Comment"}
            </button>
          </form>
        </section>
      </article>
    </section>
  );
}
