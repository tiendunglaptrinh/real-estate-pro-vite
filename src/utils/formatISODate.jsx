// utils/format.js
const formatISODate = (isoString) => {
  const date = new Date(isoString);

  // Ví dụ: 07/09/2025 12:03 (giờ Việt Nam)
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatISODate;


// Relative time cho UI
export const formatDateUI = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date; // mili giây
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Vừa xong";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    return `${diffDays} ngày trước`;
  }
};
