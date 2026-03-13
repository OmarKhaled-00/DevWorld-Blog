import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import PostHeader from "./PostHeader";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import setState from "../../utils/setState";
import { GetPosts } from "../../services/postApi.services";
export default function Post() {
  const location = useLocation();
  const postId = location.state.postId;
  const [showMore, setShowMore] = useState(false);
  const { data: post } = useQuery({
    queryKey: ["posts"],
    queryFn: GetPosts, // ✅ required
    select: (data) => data.posts.find((p) => p.id === postId),
  });

  if (!post) return <p>Post not found</p>;
  console.log(post);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: post?.content_json || "", // fallback
    editable: false,
  });

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
        <article className="p-2">
          <PostHeader posts={post} />

          {/* Post content */}
          <section className="mt-6 mb-6 flex flex-col">
            <p className="mb-5 text-center text-4xl uppercase underline">
              {post.title}
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
            {Array.isArray(post.post_tag)
              ? post.post_tag.map((t) => (
                  <span
                    key={t.id}
                    className="rounded bg-blue-600 px-2 py-1 text-white"
                  >
                    {t.tagname}
                  </span>
                ))
              : post.post_tag?.tagname && (
                  <span className="rounded bg-blue-600 px-2 py-1 text-white">
                    {post.post_tag.tagname}
                  </span>
                )}
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
            <div className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={ICONS.like}
                className="text-[18px] text-blue-600"
              />
              <span>12</span>
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
          <section className="flex items-center justify-between border-t-2 border-t-(--color-border) p-3 *:flex *:cursor-pointer *:flex-col *:items-center *:gap-0.5 *:capitalize">
            <button className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-blue-600">
              <FontAwesomeIcon
                icon={ICONS.like}
                className="text-[18px] text-blue-600"
              />
              <p>like</p>
            </button>

            <button className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-teal-600">
              <FontAwesomeIcon
                icon={ICONS.comment}
                className="text-[18px] text-teal-600"
              />
              <p>comment</p>
            </button>

            <button className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-cyan-800">
              <FontAwesomeIcon
                icon={ICONS.repost}
                className="text-[18px] text-cyan-800"
              />
              <p>repost</p>
            </button>

            <button className="border-none p-1 hover:rounded-[10px] hover:border-2 hover:border-(--color-success)">
              <FontAwesomeIcon
                icon={ICONS.trend}
                className="text-[18px] text-(--color-success)"
              />
              <p>trend</p>
            </button>
          </section>

          {/* Comments */}
          <section className="relative flex flex-col p-1">
            <h4 className="mb-2 p-2 capitalize">comments</h4>

            {/* Main Comment */}
            <article className="relative flex">
              <span className="absolute top-2 left-4 h-[calc(100%+1.8rem)] w-10 border-b-2 border-l-2 border-white/65"></span>

              <div className="flex flex-col">
                <header className="mb-6 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <img src="./circle.png" className="h-8 w-8" />
                    <div>
                      <p className="capitalize">ahmed hamdy</p>
                      <p className="text-[12px] text-white/70">
                        full stack web developer
                      </p>
                    </div>
                  </div>
                  <time className="text-white/60">2 min</time>
                </header>

                <div className="ml-10 flex flex-col gap-2">
                  <p>This is sample comment content for UI preview only.</p>

                  <div className="ml-10 flex w-fit items-center gap-2 text-[12px]">
                    <button className="cursor-pointer rounded-[10px] border-2 border-blue-700 p-1 hover:bg-blue-800">
                      like
                    </button>

                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon
                        icon={ICONS.like}
                        className="text-[14px] text-blue-600"
                      />
                      <span>2</span>
                    </div>

                    <span className="mx-2 h-8 w-1 border-2 bg-white"></span>

                    <button className="cursor-pointer rounded-[10px] border-2 border-violet-700 p-1 hover:bg-violet-700">
                      reply
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Reply Comment */}
            <div className="relative mt-4 ml-14 flex gap-2">
              <div className="flex flex-col gap-1 rounded-md border-2 border-solid border-(--color-border) p-2">
                <header className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex gap-1">
                    <img src="./circle.png" className="h-7 w-7 rounded-full" />
                    <div className="flex flex-col gap-0.5">
                      <p className="capitalize">omar khaled</p>
                      <p className="text-[12px] text-white/70">
                        Full Stack Web Developer
                      </p>
                    </div>
                  </div>
                  <time className="text-xs text-white/60">now</time>
                </header>

                <p className="text-sm">
                  This is a reply content (UI only for now).
                </p>

                <div className="ml-10 flex w-fit items-center gap-2 text-[12px]">
                  <button className="cursor-pointer rounded-[10px] border-2 border-blue-700 p-1 hover:bg-blue-800">
                    like
                  </button>

                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={ICONS.like}
                      className="text-[14px] text-blue-600"
                    />
                    <span>2</span>
                  </div>

                  <span className="mx-2 h-8 w-1 border-2 bg-white"></span>

                  <button className="cursor-pointer rounded-[10px] border-2 border-violet-700 p-1 hover:bg-violet-700">
                    reply
                  </button>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* Comment input */}
        <section className="sticky bottom-0 flex w-full items-center gap-2 bg-linear-to-r from-[#000000] to-[#151f38] p-3">
          <aside>
            <img
              src="./subscribe.jpg"
              className="h-10 w-10 rounded-full object-cover"
            />
          </aside>

          <form className="flex flex-1 items-center gap-2">
            <input
              className="flex-1 rounded-[20px] border-2 border-(--color-border) p-2"
              type="text"
              placeholder="Write a comment..."
            />

            <button className="cursor-pointer hover:text-(--color-success)">
              Comment
            </button>
          </form>
        </section>
      </article>
    </section>
  );
}
