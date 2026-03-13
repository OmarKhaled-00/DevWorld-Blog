import axios from "axios";
import { ENV } from "../config/ENV";

export async function CreatePost(payload) {
  try {
    const res = await axios.post(`${ENV.BASE_URL}/create/posts`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed creating post..." };
  }
}

export async function CreateLikes(post_id, user_id) {
  try {
    console.log("postId: ", post_id);
    console.log("userId: ", user_id);
    const res = await axios.post(`${ENV.BASE_URL}/like/${post_id}/${user_id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed creating likes..." };
  }
}

export async function CreateTrend(post_id, user_id) {
  try {
    const res = await axios.post(`${ENV.BASE_URL}/trend/${post_id}/${user_id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed creating trend..." };
  }
}

export async function CreateRepost(post_id, user_id) {
  try {
    const res = await axios.post(
      `${ENV.BASE_URL}/repost/${post_id}/${user_id}`,
    );
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed creating repost..." };
  }
}

export async function SavePost(post_id, user_id) {
  try {
    const res = await axios.post(
      `${ENV.BASE_URL}/save/post/${post_id}/${user_id}`,
    );
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed saving post..." };
  }
}

export async function GetPosts() {
  try {
    const res = await axios.get(`${ENV.BASE_URL}/get/posts`, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed reloding posts..." };
  }
}

export async function FetchPost(user_id, content_text) {
  try {
    const res = await axios.post(
      `${ENV.BASE_URL}/fetch/post/${user_id}`,
      { content_text },
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed fetching post..." };
  }
}

export async function ToggleFollow(user_id, isFollowing) {
  if (isFollowing) {
    try {
      const res = await axios.delete(`${ENV.BASE_URL}/unfollow/${user_id}`, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed unfollow user...",
      };
    }
  } else {
    try {
      const res = await axios.post(
        `${ENV.BASE_URL}/follow/${user_id}`,
        {},
        {
          withCredentials: true,
        },
      );
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed follow user...",
      };
    }
  }
}

export async function GetPostLikes(post_id) {
  try {
    const res = await axios.get(`${ENV.BASE_URL}/get/likes/${post_id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed get post likes..." };
  }
}

export async function GetUserInfo(user_id) {
  try {
    const res = await axios.get(`${ENV.BASE_URL}/get/userInfo/${user_id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err || "Failed get user info..." };
  }
}
