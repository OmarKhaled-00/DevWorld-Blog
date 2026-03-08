import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { GetUserInfo } from "../../services/postApi.services";
function PostHeader() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [userCareer, setUserCareer] = useState("");
  useEffect(() => {
    async function fetchUser() {
      const res = await GetUserInfo(user.id);
      setProfileImage(res.userInfo[0].img_url);
      setUserCareer(res.userInfo[0].career);
    }

    if (user?.id) {
      fetchUser();
    }
  }, [user.id]);

  console.log("user inside header: ", user);
  return (
    <header className="my-2 flex justify-between">
      <div className="flex gap-2">
        <a href="/profile" className="cursor-pointer">
          <img
            src={profileImage}
            alt="Author avatar"
            className="h-12 w-12 rounded-[50%] object-fill"
          />
        </a>

        <div className="flex flex-col gap-0.5 *:capitalize">
          <a href="/profile" className="cursor-pointer">
            {user.f_name + user.l_name}
          </a>
          <p className="text-[12px] text-white/70">{userCareer}</p>
          {/* Time of post */}
          <time className="text-white/70">
            3d · <FontAwesomeIcon icon={ICONS.world} />
          </time>
        </div>
      </div>

      <button className="mr-1 flex h-fit cursor-pointer items-center gap-2 rounded-[20px] border-2 border-solid border-(--color-border) p-2 text-blue-600 capitalize hover:bg-(--color-border) hover:text-white">
        <FontAwesomeIcon icon={ICONS.Plus} />
        follow
      </button>
    </header>
  );
}

export default PostHeader;
