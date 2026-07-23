// Chuyển đổi định dạng số giây sang định dạng chuỗi hiển thị phút:giây
export const formatDuration = (sec: number | string) => {
  if (typeof sec === "string") return sec;
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};


// Chuyển đổi số lượt nghe của bài hát thành chuỗi thu gọn dạng K hoặc M
export const formatPlays = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
};