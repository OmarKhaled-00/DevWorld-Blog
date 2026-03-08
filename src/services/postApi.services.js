import axios from "axios";
import { ENV } from "../config/ENV";

export async function CreatePost(payload) {
  try {
    const res = await axios.post(`${ENV.BASE_URL}/create/posts`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function CreateLikes(post_id, user_id) {
  try {
    const res = await axios.post(`${ENV.BASE_URL}/like/${post_id}/${user_id}`);
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function CreateTrend(post_id,user_id) {
  try {
    const res = await axios.post(`${ENV.BASE_URL}/trend/${post_id}/${user_id}`);
    return res.data;
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
  }
}

export async function GetPostLikes(post_id) {
  try {
    const res = await axios.get(`${ENV.BASE_URL}/get/likes/${post_id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function GetUserInfo(user_id) {
  try {
    const res = await axios.get(`${ENV.BASE_URL}/get/userInfo/${user_id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
