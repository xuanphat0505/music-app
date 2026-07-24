import { create } from "zustand";
import { Track } from "@/types";
import { musicApi } from "@/apis/musicApi";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isBuffering: boolean;
  recentlyPlayed: Track[];
  isFullPlayerVisible: boolean;
  currentLyrics: { lyrics?: string; syncedLyrics?: string } | null;
  isLyricsLoading: boolean;
  playTrack: (track: Track | any) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsFullPlayerVisible: (visible: boolean) => void;
  stopTrack: () => void;
  setIsBuffering: (isBuffering: boolean) => void;
  fetchLyrics: (songId: string) => Promise<void>;
  resetLyrics: () => void;
}

// Khởi tạo kho lưu trữ trạng thái phát nhạc toàn cục của ứng dụng giúp điều phối hoạt động phát nhạc
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  isBuffering: false,
  recentlyPlayed: [],
  isFullPlayerVisible: false,
  currentLyrics: null,
  isLyricsLoading: false,

  // Hàm kích hoạt phát một bài hát mới và thiết lập lại các thông số thời gian cùng danh sách phát gần đây
  playTrack: (track) => {
    // Gọi tải lời bài hát bất đồng bộ ngay khi đổi bài
    if (track._id) {
      setTimeout(() => {
        get().fetchLyrics(track._id);
      }, 0);
    }
    
    set((state) => {
      // Loại bỏ bài hát trùng lặp trong lịch sử cũ
      const filtered = state.recentlyPlayed.filter((t) => t._id !== track._id);
      // Chèn bài hát mới lên đầu danh sách và giới hạn tối đa sáu phần tử
      const updatedList = [track, ...filtered].slice(0, 6);
      return {
        currentTrack: track,
        isPlaying: true,
        progress: 0,
        duration: track.duration,
        isBuffering: true,
        recentlyPlayed: updatedList,
        isFullPlayerVisible: false,
        currentLyrics: null, // Reset lời bài hát cũ
      };
    });
  },

  // Hàm chuyển đổi trạng thái tạm dừng hoặc tiếp tục phát nhạc hiện tại
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Hàm cập nhật tiến trình phát nhạc hiện tại theo thời gian thực
  setProgress: (progress) => set({ progress }),

  // Hàm cập nhật tổng thời lượng của bài hát đang phát
  setDuration: (duration) => set({ duration }),

  // Hàm cập nhật trạng thái hiển thị của trình phát nhạc lớn
  setIsFullPlayerVisible: (visible) => set({ isFullPlayerVisible: visible }),

  // Hàm dừng phát nhạc và đặt lại các trạng thái về ban đầu để đóng trình phát
  stopTrack: () => set({ currentTrack: null, isPlaying: false, progress: 0, duration: 0, isBuffering: false, currentLyrics: null }),

  // Hàm cập nhật trạng thái đang tải hoặc buffering nhạc từ thiết bị native
  setIsBuffering: (isBuffering) => set({ isBuffering }),

  // Hàm tải lời bài hát bất đồng bộ từ Server và lưu vào cache của store
  fetchLyrics: async (songId) => {
    if (!songId) return; // Bảo vệ tránh gọi API với ID rỗng
    set({ isLyricsLoading: true, currentLyrics: null });
    try {
      const response = await musicApi.getSongLyrics(songId);
      // Gán trực tiếp và dùng fallback để đảm bảo currentLyrics luôn là object không null
      set({ currentLyrics: response || { lyrics: "", syncedLyrics: "" }, isLyricsLoading: false });
    } catch {
      // Đặt giá trị rỗng để tránh vòng lặp gọi API vô hạn khi xảy ra lỗi kết nối
      set({ currentLyrics: { lyrics: "", syncedLyrics: "" }, isLyricsLoading: false });
    }
  },

  // Hàm đặt lại trạng thái lời bài hát về trống
  resetLyrics: () => set({ currentLyrics: null, isLyricsLoading: false }),
}));
