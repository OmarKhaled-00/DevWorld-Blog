import cloudinary from "../../Config/cloudinary.js";
import db from "../database/db.js";
import fs from "fs";
const uploadCloudController = async (req, res) => {
  try {
    // just additional security layer
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    console.log(req.files);

    // Normalize files into array
    // if files are not array make it array
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];

    const uploadedResults = [];

    for (const file of files) {
      // Folder decision
      let folderName = "blog_raws";
      if (file.mimetype.startsWith("image/")) folderName = "blog_images";
      if (file.mimetype.startsWith("video/")) folderName = "blog_videos";

      const fileData = `data:${file.mimetype};base64,${file.data.toString(
        "base64",
      )}`;

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: folderName,
        resource_type: file.mimetype.startsWith("video/") ? "video" : "auto",
      });

      // Delete temp file after upload
      fs.unlinkSync(file.tempFilePath);
      const baseType = file.mimetype.split("/")[0];
      uploadedResults.push({
        url: result.secure_url,
        type: baseType,
      });
    }

    return res.json({
      success: true,
      files: uploadedResults,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const uploadDBController = async (req, res) => {
  try {
    const { postMediaData, postId } = req.body;

    if (!postMediaData || !postId) {
      return res.status(400).json({ error: "Missing post or media data" });
    }

    const insertedMedia = [];

    const types = postMediaData.map((m) => m.type);
    const urls = postMediaData.map((m) => m.url);
    const mimeTypes = postMediaData.map((m) => m.mimeType);

    const result = await db.query(
      `
  INSERT INTO posts_media(post_id, media_type, mimi_type, url)
  SELECT $1, UNNEST($2::media_enum[]), $3, UNNEST($4::text[]) 
  RETURNING *
`,
      [postId, types, mimeTypes, urls],
    );

    insertedMedia.push(result.rows);

    return res.status(200).json({
      success: true,
      message: "Media saved in DB successfully",
      media: insertedMedia,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export default uploadCloudController;
export { uploadDBController };
