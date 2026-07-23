import { create } from "zustand";
import { playlistApi } from "@/apis/playlistApi";
import { Playlist, Track } from "@/types";

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  getPlaylistDetails: (playlistId: string) => Promise<void>;
  createPlaylist: (title: string, description?: string) => Promise<Playlist | null>;
  deletePlaylist: (playlistId: string) => Promise<boolean>;
  addSongToPlaylist: (playlistId: string, song: Track) => Promise<boolean>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<boolean>;
}

// Zustand store quản lý trạng thái các danh sách phát cá nhân của người dùng
export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Tải danh sách phát của người dùng từ server về store
  fetchPlaylists: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const data = await playlistApi.getUserPlaylists();
      set({
        playlists: data || [],
        isLoading: false,
        isInitialized: true,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Không thể tải danh sách phát.",
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  // Tải chi tiết một danh sách phát kèm dữ liệu các bài hát
  getPlaylistDetails: async (playlistId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await playlistApi.getPlaylistById(playlistId);
      set({
        currentPlaylist: data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Không thể tải chi tiết danh sách phát.",
        isLoading: false,
      });
    }
  },

  // Tạo một danh sách phát mới và cập nhật tức thì vào store
  createPlaylist: async (title: string, description?: string) => {
    try {
      const newPlaylist = await playlistApi.createPlaylist({
        title,
        description,
      });
      if (newPlaylist) {
        set((state) => ({
          playlists: [newPlaylist, ...state.playlists],
        }));
      }
      return newPlaylist;
    } catch (err: any) {
      set({ error: err?.message || "Không thể tạo danh sách phát." });
      return null;
    }
  },

  // Xóa danh sách phát với cơ chế optimistic update
  deletePlaylist: async (playlistId: string) => {
    const previousPlaylists = get().playlists;
    set((state) => ({
      playlists: state.playlists.filter((p) => p._id !== playlistId),
      currentPlaylist:
        state.currentPlaylist?._id === playlistId
          ? null
          : state.currentPlaylist,
    }));

    try {
      await playlistApi.deletePlaylist(playlistId);
      return true;
    } catch (err: any) {
      set({
        playlists: previousPlaylists,
        error: err?.message || "Không thể xóa danh sách phát.",
      });
      return false;
    }
  },

  // Thêm bài hát vào danh sách phát và cập nhật coverUrls cùng danh sách bài hát
  addSongToPlaylist: async (playlistId: string, song: Track) => {
    const songId = song._id;
    const previousPlaylists = [...get().playlists];

    set((state) => ({
      playlists: state.playlists.map((playlist) => {
        if (playlist._id !== playlistId) return playlist;
        const currentSongs = playlist.songs || [];
        const exists = currentSongs.some((item) =>
          typeof item === "string" ? item === songId : item._id === songId,
        );
        if (exists) return playlist;

        const updatedSongs = [...currentSongs, song];
        const updatedCovers = updatedSongs
          .map((s) => (typeof s === "string" ? "" : s.artwork))
          .filter(Boolean)
          .slice(0, 4);

        return {
          ...playlist,
          songs: updatedSongs,
          coverUrls: updatedCovers.length > 0 ? updatedCovers : playlist.coverUrls,
        };
      }),
    }));

    try {
      const updatedPlaylist = await playlistApi.addSongToPlaylist(
        playlistId,
        songId,
      );
      if (updatedPlaylist) {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p._id === playlistId ? updatedPlaylist : p,
          ),
          currentPlaylist:
            state.currentPlaylist?._id === playlistId
              ? updatedPlaylist
              : state.currentPlaylist,
        }));
      }
      return true;
    } catch (err: any) {
      set({
        playlists: previousPlaylists,
        error: err?.message || "Không thể thêm bài hát vào danh sách phát.",
      });
      return false;
    }
  },

  // Xóa bài hát khỏi danh sách phát
  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    const previousPlaylists = [...get().playlists];

    set((state) => ({
      playlists: state.playlists.map((playlist) => {
        if (playlist._id !== playlistId) return playlist;
        const currentSongs = playlist.songs || [];
        const updatedSongs = currentSongs.filter((item) =>
          typeof item === "string" ? item !== songId : item._id !== songId,
        );

        return {
          ...playlist,
          songs: updatedSongs,
        };
      }),
    }));

    try {
      const updatedPlaylist = await playlistApi.removeSongFromPlaylist(
        playlistId,
        songId,
      );
      if (updatedPlaylist) {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p._id === playlistId ? updatedPlaylist : p,
          ),
          currentPlaylist:
            state.currentPlaylist?._id === playlistId
              ? updatedPlaylist
              : state.currentPlaylist,
        }));
      }
      return true;
    } catch (err: any) {
      set({
        playlists: previousPlaylists,
        error: err?.message || "Không thể xóa bài hát khỏi danh sách phát.",
      });
      return false;
    }
  },
}));
