export interface LrcLine {
  id: string;
  time: number;
  text: string;
}

// Chuyển đổi chuỗi mốc thời gian dạng mm:ss.xx hoặc mm:ss:xx thành mili-giây
const parseTimeToMs = (timeStr: string): number => {
  // Chuẩn hóa dấu hai chấm cuối cùng thành dấu chấm để xử lý đồng nhất định dạng
  const normalizedStr = timeStr.replace(/:(\d{2,3})$/, ".$1");
  const parts = normalizedStr.split(":");
  
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const secondParts = parts[1].split(".");
    const seconds = parseInt(secondParts[0], 10);
    const msStr = secondParts[1] || "0";
    const ms = parseInt(msStr, 10) * (msStr.length === 2 ? 10 : 1);
    
    return minutes * 60 * 1000 + seconds * 1000 + ms;
  }
  
  return 0;
};

// Phân tích cú pháp chuỗi LRC thô thành mảng đối tượng LrcLine phục vụ chạy Karaoke
export const parseLrc = (lrcString: string): LrcLine[] => {
  if (!lrcString) {
    return [];
  }

  const lines = lrcString.split('\n');
  const result: LrcLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})[.:](\d{2,3})\]/;

  lines.forEach((line, index) => {
    const match = timeRegex.exec(line);
    if (match) {
      // Trích xuất mốc thời gian nằm trong dấu ngoặc vuông
      const timeStr = match[0].replace('[', '').replace(']', '');
      // Trích xuất nội dung lời hát phía sau mốc thời gian
      const text = line.replace(timeRegex, '').trim();

      // Chỉ thêm vào danh sách nếu có nội dung hoặc chứa dấu đóng ngoặc (loại bỏ thông tin tiêu đề)
      if (text || line.includes(']')) {
        result.push({
          id: `lrc-${index}-${Date.now()}`,
          time: parseTimeToMs(timeStr),
          text: text || '♫',
        });
      }
    }
  });

  // Sắp xếp các câu hát theo trình tự thời gian tăng dần
  return result.sort((a, b) => a.time - b.time);
};
