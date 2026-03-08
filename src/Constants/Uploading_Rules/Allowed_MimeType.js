const ALLOWED_MIME_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/jpg"],

  video: ["video/mp4", "video/webm", "video/mov", "video/avi"],

  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
  ],
};

// handy flat array if needed
const ALL_ALLOWED_MIME_TYPES = Object.values(ALLOWED_MIME_TYPES).flat();
export default ALL_ALLOWED_MIME_TYPES;
