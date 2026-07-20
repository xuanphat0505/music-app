import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

// Wrapper quản lý các cuộc gọi API liên quan tới Thư viện cá nhân của người dùng
export const libraryApi = {
  // Thêm hoặc xóa bài hát khỏi thư viện cá nhân của người dùng
  toggleLibrarySong: async (songId: string) => {
    const response: any = await apiClient.post(
      ENDPOINTS.LIBRARIES.TOGGLE(songId),
    );
    return response.data;
  },

  // Lấy danh sách bài hát trong thư viện cá nhân có phân trang
  getLibrarySongs: async (params?: { page?: number; limit?: number }) => {
    const response: any = await apiClient.get(ENDPOINTS.LIBRARIES.SONGS, {
      params,
    });
    return response.data;
  },

  // Lấy danh sách toàn bộ ID bài hát đã thêm vào thư viện cá nhân
  getLibrarySongIds: async (): Promise<string[]> => {
    const response: any = await apiClient.get(ENDPOINTS.LIBRARIES.IDS);
    return response.data;
  },
};
