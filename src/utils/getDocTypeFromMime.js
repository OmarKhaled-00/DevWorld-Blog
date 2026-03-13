export const getDocTypeFromMime = (mime) => {
  if (!mime) return "document";
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("word")) return "word";
  if (mime.includes("presentation")) return "powerpoint";
  return "document";
};
