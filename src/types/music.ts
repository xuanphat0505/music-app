// Thực thể bài hát
export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  genre?: string;
  plays?: string;
}

// Thực thể danh sách phát
export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrls: string[];
}

// Thực thể nghệ sĩ
export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
}

// Thực thể album nhạc
export interface Album {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
}

// Thực thể thể loại nhạc khám phá
export interface Category {
  id: string;
  title: string;
  colors: [string, string];
  coverUrl: string;
}
