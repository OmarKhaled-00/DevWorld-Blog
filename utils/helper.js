export function calculateReadTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // seconds

  if (diff < 60) return `${diff} sec`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} d`;
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} mo`;
  return `${Math.floor(diff / 31104000)} y`;
}
