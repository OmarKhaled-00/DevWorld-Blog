import ALL_ALLOWED_MIME_TYPES from "../Constants/Uploading_Rules/Allowed_MimeType";
import MAX_SIZES from "../Constants/Uploading_Rules/Max_Size";
export function validateFiles(selectedFiles) {
  console.log("selected files: ", selectedFiles);

  if (selectedFiles.length === 0)
    return { valid: false, message: "No files selected" };

  if (
    selectedFiles.some((f) => f.type.startsWith("video/")) &&
    selectedFiles.length > 1
  ) {
    return { valid: false, message: "You can upload one video only" };
  }

  if (selectedFiles.filter((f) => f.type.startsWith("image/")).length > 10) {
    return { valid: false, message: "You can upload only 10 images" };
  }

  if (
    selectedFiles.some((f) => f.type.startsWith("application/")) &&
    selectedFiles.length > 1
  ) {
    return { valid: false, message: "You can upload one Document only" };
  }

  if (
    selectedFiles.some((f) => f.type.startsWith("video/")) &&
    selectedFiles.some((f) => f.type.startsWith("image/"))
  ) {
    return {
      valid: false,
      message: "You can upload multiple images OR one video only",
    };
  }

  // MIME validation
  for (const file of selectedFiles) {
    if (!ALL_ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        message:
          "Only images, videos, PDF, Word, and PowerPoint files are allowed",
      };
    }
  }

  // Size validation
  for (const file of selectedFiles) {
    let typeGroup;

    if (file.type.startsWith("image/")) {
      typeGroup = "image";
    } else if (file.type.startsWith("video/")) {
      typeGroup = "video";
    } else {
      typeGroup = "application";
    }

    console.log("file.size:", file.size);
    console.log("max allowed:", MAX_SIZES[typeGroup]);

    if (file.size > MAX_SIZES[typeGroup]) {
      return {
        valid: false,
        message: `File exceeds the allowed size (${typeGroup})`,
      };
    }
  }

  return { valid: true };
}
