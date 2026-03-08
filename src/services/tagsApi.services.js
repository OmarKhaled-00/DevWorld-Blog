import axios from "axios";
import { ENV } from "../config/ENV";

export async function getTags(setState) {
  try {
    const tags = await axios.get(`${ENV.BASE_URL}/get/tags`, {
      withCredentials: true,
    });

    if (tags.length === 0) {
      return;
    }
    const tagsName = tags.data.tags;

    setState(tagsName.map((tag) => tag.name));
  } catch (err) {
    console.error(err);
  }
}

export async function saveTages(post_id, selected_tags) {
  try {
    const result = await axios.post(
      `${ENV.BASE_URL}/add/tags/${post_id}`,
      selected_tags,
      { withCredentials: true },
    );

    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
