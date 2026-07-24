// Bản đồ màu sắc gradient và hình ảnh cho từng thể loại nhạc để giữ giao diện đẹp mắt
export const GENRE_STYLE_MAP: Record<
  string,
  { colors: [string, string]; coverUrl: string }
> = {
  pop: {
    colors: ["#ff5a14", "#ff8f59"],
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=150&auto=format&fit=crop",
  },
  rock: {
    colors: ["#4d44b5", "#6b5ce7"],
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=150&auto=format&fit=crop",
  },
  edm: {
    colors: ["#00e5c9", "#00b39d"],
    coverUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150&auto=format&fit=crop",
  },
  jazz: {
    colors: ["#ff5a14", "#4d44b5"],
    coverUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=150&auto=format&fit=crop",
  },
  "hip hop": {
    colors: ["#4d44b5", "#00e5c9"],
    coverUrl:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop",
  },
  indie: {
    colors: ["#18181c", "#2c2c35"],
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=150&auto=format&fit=crop",
  },
};

export const PRESET_STYLES: { colors: [string, string]; coverUrl: string }[] = [
  {
    colors: ["#8e2de2", "#4a00e0"], // Deep Purple
    coverUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=150&auto=format&fit=crop",
  },
  {
    colors: ["#e91e63", "#673ab7"], // Violet Pink
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=150&auto=format&fit=crop",
  },
  {
    colors: ["#ff00cc", "#333399"], // Synthwave / K-Pop
    coverUrl:
      "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=150&auto=format&fit=crop",
  },
  {
    colors: ["#005c97", "#363795"], // R&B / Deep Ocean Blue
    coverUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=150&auto=format&fit=crop",
  },
  {
    colors: ["#11998e", "#38ef7d"], // Green / Acoustic
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=150&auto=format&fit=crop",
  },
  {
    colors: ["#fc4a1a", "#f7b733"], // Warm Orange-Gold / Dance
    coverUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150&auto=format&fit=crop",
  },
  {
    colors: ["#000428", "#004e92"], // Space Dark Blue / Soundtrack
    coverUrl:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop",
  },
];

// Hàm băm tên thể loại nhạc để tự động gán gradient và hình ảnh bắt mắt cố định
// Hỗ trợ kiểm tra dữ liệu đầu vào hợp lệ tránh xảy ra lỗi null
export const getGenreStyle = (genre: string) => {
  if (!genre || typeof genre !== "string") {
    return PRESET_STYLES[0];
  }
  const normalized = genre.toLowerCase().trim();
  if (GENRE_STYLE_MAP[normalized]) {
    return GENRE_STYLE_MAP[normalized];
  }
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PRESET_STYLES.length;
  return PRESET_STYLES[index];
};
