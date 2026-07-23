import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import { Playlist } from "@/types";

// Wrapper quản lý các cuộc gọi API liên quan tới Danh sách phát (Playlists)
export const playlistApi = {
  // Lấy toàn bộ danh sách phát của người dùng hiện tại
  getUserPlaylists: async (): Promise<Playlist[]> => {
    const response: any = await apiClient.get(ENDPOINTS.PLAYLISTS.BASE);
    return response.data;
  },

  // Lấy thông tin chi tiết một danh sách phát kèm dữ liệu bài hát
  getPlaylistById: async (id: string): Promise<Playlist> => {
    const response: any = await apiClient.get(ENDPOINTS.PLAYLISTS.DETAIL(id));
    return response.data;
  },

  // Tạo mới một danh sách phát cá nhân
  createPlaylist: async (data: {
    title: string;
    description?: string;
  }): Promise<Playlist> => {
    const response: any = await apiClient.post(
      ENDPOINTS.PLAYLISTS.BASE,
      data,
    );
    return response.data;
  },

  // Thêm một bài hát vào danh sách phát
  addSongToPlaylist: async (
    playlistId: string,
    songId: string,
  ): Promise<Playlist> => {
    const response: any = await apiClient.post(
      ENDPOINTS.PLAYLISTS.ADD_SONG(playlistId),
      { songId },
    );
    return response.data;
  },

  // Xóa bài hát khỏi danh sách phát
  removeSongFromPlaylist: async (
    playlistId: string,
    songId: string,
  ): Promise<Playlist> => {
    const response: any = await apiClient.delete(
      ENDPOINTS.PLAYLISTS.REMOVE_SONG(playlistId, songId),
    );
    return response.data;
  },

  // Xóa một danh sách phát cá nhân
  deletePlaylist: async (playlistId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PLAYLISTS.DETAIL(playlistId));
  },

  // Cập nhật thông tin tiêu đề và mô tả danh sách phát
  updatePlaylist: async (
    playlistId: string,
    data: { title?: string; description?: string },
  ): Promise<Playlist> => {
    const response: any = await apiClient.patch(
      ENDPOINTS.PLAYLISTS.DETAIL(playlistId),
      data,
    );
    return response.data;
  },
};
