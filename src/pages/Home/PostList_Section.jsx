import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { GetPosts } from "../../services/postApi.services";
import { timeAgo } from "../../utils/timeAgo";
import { CreateLikes, CreateTrend } from "../../services/postApi.services";
import { useAuth } from "../../hooks/useAuth";
import { formatNumber } from "../../utils/formatNumber";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getDocTypeFromMime = (mime) => {
  if (!mime) return "document";
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("word")) return "word";
  if (mime.includes("presentation")) return "powerpoint";
  return "document";
};
function PostList_Section() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch posts
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: GetPosts,
    refetchInterval: 30000,
  });

  const posts = data?.posts || [];

  // ✅ Like Mutation
  const likeMutation = useMutation({
    mutationFn: ({ postId }) => CreateLikes(postId, user.id),

    // 🔥 Optimistic Update
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          posts: oldData.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes_count: p.liked_by_user
                    ? Number(p.likes_count) - 1
                    : Number(p.likes_count) + 1,
                  liked_by_user: !p.liked_by_user,
                }
              : p,
          ),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      // rollback if error
      queryClient.setQueryData(["posts"], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // ✅ Trend Mutation
  const trendMutation = useMutation({
    mutationFn: ({ postId }) => CreateTrend(postId, user.id),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          posts: oldData.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  trend_count: !p.trended_by_user
                    ? Number(p.trend_count) + 1
                    : Number(p.trend_count) - 1,
                  trended_by_user: !p.trended_by_user,
                }
              : p,
          ),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts"], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLikes = (postId) => {
    likeMutation.mutate({ postId });
  };

  const handleTrends = (postId) => {
    trendMutation.mutate({ postId });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <section className="grid grid-cols-3 gap-2 max-md:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => {
        const video = post.post_media.find((m) => m.media_type === "video");
        const application = post.post_media.find(
          (m) => m.media_type === "application",
        );

        // Parse mime_type
        const mimeType = application?.mime_type;

        // Determine doc type
        const docType = getDocTypeFromMime(mimeType);

        console.log("mimeType:", mimeType); // "application/pdf"
        console.log("docType:", docType); // "pdf"

        const mediaType = video
          ? "video"
          : application
            ? "application"
            : "image";

        const isDocument = mediaType === "application";
        return (
          <div
            className="animate__animated animate__backInLeft max-h-112.5"
            key={index}
          >
            <article
              className={`animate-revolve3D group/card transform-style:3d flex h-full w-full cursor-pointer flex-col gap-0 overflow-hidden rounded-[20px] border-2 border-[rgba(6,182,212,0.3)] bg-(--color-input) shadow-[0_4px_8px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.19)] transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] perspective-[1000px]`}
            >
              {(() => {
                switch (mediaType) {
                  case "video":
                    return (
                      <video
                        src={video.url}
                        className="h-62.5 w-full object-cover"
                        controls
                        muted
                        controlsList="nodownload"
                        playsInline
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    );

                  case "application":
                    return (
                      <div className="relative h-96 w-full overflow-x-hidden rounded-xl border">
                        <iframe
                          src={`https://docs.google.com/gview?url=${application.url}&embedded=true`}
                          title="document"
                          className="absolute top-0 h-full w-full"
                        />
                        <span className="absolute top-2 left-2 flex items-center gap-1 rounded px-2 py-1 text-lg">
                          {docType === "pdf" && (
                            <FontAwesomeIcon
                              icon={ICONS.pdf}
                              className="text-[#E74C3C]"
                            />
                          )}
                          {docType === "word" && (
                            <FontAwesomeIcon
                              icon={ICONS.word}
                              className="text-blue-500"
                            />
                          )}
                          {docType === "powerpoint" && (
                            <FontAwesomeIcon
                              icon={ICONS.powerpoint}
                              className="text-[#E74C3C]"
                            />
                          )}
                        </span>
                      </div>
                    );

                  case "image":
                  default:
                    return (
                      <div
                        className={`grid gap-2 ${
                          post.post_media.length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        }`}
                      >
                        {post.post_media.slice(0, 2).map((image, index) => {
                          const isLastVisible =
                            index === 1 && post.post_media.length - 2 > 0;

                          return (
                            <div
                              key={index}
                              className="relative overflow-hidden rounded-xl"
                            >
                              <img
                                src={image.url}
                                className={`w-full object-cover ${
                                  post.post_media.length === 1
                                    ? "max-h-65"
                                    : "h-62.5"
                                }`}
                              />

                              {isLastVisible && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-3xl font-bold text-white">
                                  +{post.post_media.length - 2}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                }
              })()}
              <header
                className={` ${isDocument ? "h-fit items-end" : "absolute top-0 h-fit overflow-hidden "} flex w-full justify-between rounded-t-[20px] p-3 transition-all duration-300`}
              >
                <span
                  className={` ${post.post_tag?.tagname ? "animate__animated animate__fadeInUp group-hover/card:block " : "opacity-0"} m-3 hidden h-fit rounded-[15px] bg-linear-to-r from-[#16a085] to-[#0ea5e9] p-1 text-[13px] capitalize max-md:p-1.5`}
                >
                  {post.post_tag?.tagname}
                </span>
                <div>
                  <nav
                    className={` ${isDocument ? "h-fit group-hover/card:flex group-hover/card:flex-row" : "group-hover/card:flex group-hover/card:flex-col"} animate__animated animate__fadeInUp hidden items-center justify-between gap-2 *:cursor-pointer *:rounded-[50%] *:border-2 *:border-solid *:border-(--color-ring) *:bg-(--color-input) *:p-1 *:text-white *:hover:bg-(--color-text-interactive) *:hover:text-black`}
                  >
                    <button>
                      <FontAwesomeIcon icon={ICONS.bookMark} />
                    </button>
                    <button>
                      <FontAwesomeIcon icon={ICONS.share} />
                    </button>
                    <button onClick={() => handleLikes(post.id)}>
                      <FontAwesomeIcon
                        className={`${post.liked_by_user ? "text-blue-600" : ""}`}
                        icon={ICONS.like}
                      />
                    </button>
                    <button onClick={() => handleTrends(post.id)}>
                      <FontAwesomeIcon
                        className={`${post.trended_by_user ? "text-green-400" : ""}`}
                        icon={ICONS.trend}
                      />
                    </button>
                  </nav>
                </div>
              </header>
              <article className="flex flex-1 flex-col justify-between gap-2 p-3">
                <header className="mb-5 flex flex-col justify-between gap-2">
                  <h3
                    className={`${post.title ? "block" : "hidden"} capitalize`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`${post.title ? "text-[12px] text-gray-300 " : "text-[16px] text-white "} capitalize`}
                  >
                    {post.content_text}
                  </p>
                </header>
                <footer className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        post.user_info.img_url
                          ? post.user_info.img_url
                          : `./dv.jpg`
                      }
                      alt=""
                      className="h-10 w-10 rounded-[50%]"
                    />
                    <div className="flex flex-col gap-1 *:text-[12px]">
                      <span>{post.author.f_name + post.author.l_name}</span>
                      <span className="text-[8px] text-white/70">
                        {post.user_info.career}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 *:text-[12px]">
                    <div className="flex items-center justify-between gap-1">
                      <FontAwesomeIcon
                        className="text-(--color-success)"
                        icon={ICONS.eye}
                      />
                      <span className="text-[14px]">
                        {formatNumber(post.views_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <FontAwesomeIcon
                        className="text-blue-600"
                        icon={ICONS.like}
                      />
                      <span className="text-[14px]">
                        {formatNumber(post.likes_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <FontAwesomeIcon
                        className="text-green-600"
                        icon={ICONS.trend}
                      />
                      <span className="text-[14px]">
                        {post.trend_score.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </footer>
              </article>
              <div className="flex justify-center">
                <time className="w-fit rounded-l-2xl rounded-r-2xl border-2 border-solid border-t-(--color-border) border-r-(--color-border) border-b-transparent border-l-(--color-border) p-0.5 text-[12px] text-(--color-text-interactive)">
                  {timeAgo(post.created_at)}
                </time>
              </div>
            </article>
          </div>
        );
      })}
    </section>
  );
}

export default PostList_Section;
