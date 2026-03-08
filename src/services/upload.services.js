// services/upload.service.js
import axios from "axios";
import { ENV } from "../config/ENV";
import { uploadStore } from "../store/uploadStore";

export async function uploadFilesAPI(postId) {
  const { files } = uploadStore.getState();

  if (!files || files.length === 0) {
    return;
  }
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const res = await axios.post(`${ENV.BASE_URL}/upload/cloud`, formData, {
      withCredentials: true,
    });
    console.log("upload to cloud", res.data);
    if (res.data.success) {
      // const postMediaData = res.data.files;
      const postMediaData = res.data.files.map((fileResult, idx) => ({
        ...fileResult,
        mimeType: files[idx].type, // <--- add this
      }));
      try {
        const res = await axios.post(
          `${ENV.BASE_URL}/upload/db`,
          { postMediaData, postId },
          { withCredentials: true },
        );
        console.log(res.data);
      } catch (err) {
        alert("Failed to upload to db ,try again...");
      }
    }
  } catch (err) {
    alert("Failed to upload to cloud ,try again...", err);
  }
}
