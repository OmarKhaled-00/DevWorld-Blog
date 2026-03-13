import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { timeAgo } from "../../utils/timeAgo";
import { useState } from "react";
import { ToggleFollow } from "../../services/postApi.services";
import { usePostActions } from "../../hooks/usePostActions";
function PostHeader({ posts }) {
  const { followProcess } = usePostActions();

  const [showUnfollow, setShowUnfollow] = useState(false);

  const FetchPost = posts;
  console.log("FetchPost: ", FetchPost);
  return (
    <header className="my-2 flex justify-between">
      <div className="flex gap-2">
        <a href="/profile" className="cursor-pointer">
          <img
            src={FetchPost.user_info.img_url}
            alt="Author avatar"
            className="h-12 w-12 rounded-[50%] object-fill"
          />
        </a>
        <div className="flex flex-col gap-0.5">
          <a href="/profile" className="cursor-pointer capitalize">
            {FetchPost.author.f_name + FetchPost.author.l_name}
          </a>
          <p className="text-[12px] text-white/70 capitalize">
            {FetchPost.user_info.career}
          </p>
          {/* Time of post */}
          <time className="text-white/70">
            {timeAgo(FetchPost.created_at)} ·
            {FetchPost.visibility === "public" ? (
              <FontAwesomeIcon icon={ICONS.world} />
            ) : (
              <FontAwesomeIcon icon={ICONS.users} />
            )}
          </time>
        </div>
      </div>

      {!FetchPost.post_belong_to_user ? (
        !FetchPost.followed_by_user ? (
          <button
            onClick={async () => {
              followProcess(FetchPost.author.id, FetchPost.followed_by_user);
            }}
            className="mr-1 flex h-fit cursor-pointer items-center gap-2 rounded-[20px] border-2 border-solid border-(--color-border) p-2 text-blue-600 capitalize hover:bg-(--color-border) hover:text-white"
          >
            <FontAwesomeIcon icon={ICONS.Plus} />
            {FetchPost.followed_by_user ? "Following" : "Follow"}
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUnfollow(!showUnfollow)}
              className="mr-1 flex h-fit cursor-pointer items-center gap-2 rounded-[20px] border-2 border-solid border-(--color-border) p-2 text-blue-600 capitalize hover:bg-(--color-border) hover:text-white"
            >
              <FontAwesomeIcon icon={ICONS.done} />
              {FetchPost.followed_by_user ? "Following" : "Follow"}
              <FontAwesomeIcon icon={ICONS.downArrow} />
            </button>

            {showUnfollow && (
              <div className="animate__animated animate__fadeIn absolute top-12 left-10 flex w-fit flex-col rounded-[10px] bg-(--color-input) opacity-[0.8] shadow-[0_0_10px_#00ffff,0_0_15px_#00ffff]">
                <button
                  onClick={async () => {
                    followProcess(
                      FetchPost.author.id,
                      FetchPost.followed_by_user,
                    );

                    setShowUnfollow(!showUnfollow);
                  }}
                  className="hover flex cursor-pointer items-center gap-1 border-b border-solid p-2 text-white capitalize hover:text-red-500"
                >
                  <FontAwesomeIcon icon={ICONS.close} />
                  unfollow
                </button>
                <button
                  onClick={() => setShowUnfollow(!showUnfollow)}
                  className="flex cursor-pointer items-center gap-1 border-t border-solid p-2 text-white capitalize hover:text-green-500"
                >
                  <FontAwesomeIcon icon={ICONS.done} />
                  keep
                </button>
              </div>
            )}
          </div>
        )
      ) : null}
    </header>
  );
}

export default PostHeader;
