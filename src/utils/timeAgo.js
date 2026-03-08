export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  const units = [
    { name: "yr", value: 31536000 },
    { name: "mo", value: 2592000 },
    { name: "d", value: 86400 },
    { name: "hr", value: 3600 },
    { name: "min", value: 60 },
    { name: "sec", value: 1 },
  ];

  for (let unit of units) {
    const amount = Math.floor(seconds / unit.value);
    if (amount >= 1) return `${amount} ${unit.name} ago`;
  }

  return "just now";
}
