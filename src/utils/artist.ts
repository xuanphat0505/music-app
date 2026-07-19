import { Artist } from "@/types/music";

// Định dạng danh sách nghệ sĩ thành chuỗi văn bản dạng "Nghệ sĩ chính ft. Nghệ sĩ phụ" để hiển thị trên UI
export const formatArtistNames = (artists?: (Artist | string)[]): string => {
  if (!artists || artists.length === 0) return "Unknown Artist";
  
  const names = artists.map((artist) => 
    typeof artist === "string" ? artist : artist.name
  );
  
  if (names.length === 1) return names[0];
  
  const [mainArtist, ...featuredArtists] = names;
  return `${mainArtist} ft. ${featuredArtists.join(", ")}`;
};
