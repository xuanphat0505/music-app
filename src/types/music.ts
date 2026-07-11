// Thực thể nghệ sĩ (phản ánh đúng dữ liệu populate từ server)
export interface Artist {
  _id: string;
  audiusId: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followerCount?: number;
}

// Thực thể bài hát (phản ánh đúng cấu trúc Song schema từ server MongoDB)
export interface Track {
  _id: string;
  audiusId: string;
  title: string;
  duration: number;
  artwork: string;
  genre?: string;
  playsCount: number;
  audiusPlaysCount: number;
  artist: Artist | string;
  album?: any;
  streamUrl?: string;
}

// Thực thể danh sách phát
export interface Playlist {
  _id: string;
  title: string;
  description: string;
  coverUrls: string[];
}

// Thực thể album nhạc
export interface Album {
  _id: string;
  audiusId?: string;
  title: string;
  artist: Artist | string;
  genre?: string;
  artwork: string;
  songs?: Track[];
}

// Thực thể thể loại nhạc khám phá
export interface Category {
  _id: string;
  title: string;
  colors: [string, string];
  coverUrl: string;
}
