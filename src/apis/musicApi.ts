import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

// Wrapper quản lý gọi các API âm nhạc, tự động bóc tách trả về phần data nghiệp vụ
export const musicApi = {
  // Lấy danh sách bài hát có phân trang, lọc theo thể loại và từ khóa tìm kiếm
  getSongs: async (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    q?: string;
    sort?: string;
  }) => {
    const response: any = await apiClient.get(ENDPOINTS.SONGS.BASE, { params });
    return response.data;
  },

  // Lấy danh sách bài hát thịnh hành (Trending)
  getTrendingSongs: async (limit?: number) => {
    const response: any = await apiClient.get(ENDPOINTS.SONGS.TRENDING, {
      params: { limit },
    });
    return response.data;
  },

  // Lấy tổng số lượng bài hát theo từng thể loại nhạc
  getGenres: async () => {
    const response: any = await apiClient.get(ENDPOINTS.SONGS.GENRES);
    return response.data;
  },

  // Lấy chi tiết thông tin bài hát theo ID hoặc spotifyId
  getSongDetail: async (id: string) => {
    const response: any = await apiClient.get(ENDPOINTS.SONGS.DETAIL(id));
    return response.data;
  },

  // Ghi nhận lượt nghe nhạc và tăng playsCount thêm 1
  playSong: async (id: string) => {
    const response: any = await apiClient.post(ENDPOINTS.SONGS.PLAY(id));
    return response.data;
  },

  // Lấy lời bài hát theo ID hoặc spotifyId
  getSongLyrics: async (id: string) => {
    const response: any = await apiClient.get(ENDPOINTS.SONGS.LYRICS(id));
    return response.data;
  },

  // Lấy danh sách nghệ sĩ/ca sĩ có phân trang và tìm kiếm
  getArtists: async (params?: {
    q?: string;
    page?: number;
    limit?: number;
  }) => {
    const response: any = await apiClient.get(ENDPOINTS.ARTISTS.BASE, {
      params,
    });
    return response.data;
  },

  // Lấy chi tiết thông tin nghệ sĩ theo ID
  getArtistDetail: async (id: string) => {
    const response: any = await apiClient.get(ENDPOINTS.ARTISTS.DETAIL(id));
    return response.data;
  },

  // Lấy danh sách toàn bộ bài hát thuộc nghệ sĩ
  getArtistSongs: async (
    id: string,
    params?: { page?: number; limit?: number },
  ) => {
    const response: any = await apiClient.get(ENDPOINTS.ARTISTS.SONGS(id), {
      params,
    });
    return response.data;
  },

  // Lấy danh sách album nhạc có phân trang
  getAlbums: async (params?: { q?: string; page?: number; limit?: number }) => {
    const response: any = await apiClient.get(ENDPOINTS.ALBUMS.BASE, {
      params,
    });
    return response.data;
  },

  // Lấy thông tin chi tiết album cùng danh sách bài hát bên trong
  getAlbumDetail: async (id: string) => {
    const response: any = await apiClient.get(ENDPOINTS.ALBUMS.DETAIL(id));
    return response.data;
  },
};
