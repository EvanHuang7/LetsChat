export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    month: "short", // e.g., "Apr"
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  });
}
