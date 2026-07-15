import { create } from "zustand";
import { Track } from "@/types";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isBuffering: boolean;
  recentlyPlayed: Track[];
  isFullPlayerVisible: boolean;
  playTrack: (track: Track | any) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsFullPlayerVisible: (visible: boolean) => void;
  stopTrack: () => void;
  setIsBuffering: (isBuffering: boolean) => void;
}

// Khởi tạo kho lưu trữ trạng thái phát nhạc toàn cục của ứng dụng giúp điều phối hoạt động phát nhạc
export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  isBuffering: false,
  recentlyPlayed: [],
  isFullPlayerVisible: false,

  // Hàm kích hoạt phát một bài hát mới và thiết lập lại các thông số thời gian cùng danh sách phát gần đây
  playTrack: (track) =>
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
        isFullPlayerVisible: true,
      };
    }),

  // Hàm chuyển đổi trạng thái tạm dừng hoặc tiếp tục phát nhạc hiện tại
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Hàm cập nhật tiến trình phát nhạc hiện tại theo thời gian thực
  setProgress: (progress) => set({ progress }),

  // Hàm cập nhật tổng thời lượng của bài hát đang phát
  setDuration: (duration) => set({ duration }),

  // Hàm cập nhật trạng thái hiển thị của trình phát nhạc lớn
  setIsFullPlayerVisible: (visible) => set({ isFullPlayerVisible: visible }),

  // Hàm dừng phát nhạc và đặt lại các trạng thái về ban đầu để đóng trình phát
  stopTrack: () => set({ currentTrack: null, isPlaying: false, progress: 0, duration: 0, isBuffering: false }),

  // Hàm cập nhật trạng thái đang tải hoặc buffering nhạc từ thiết bị native
  setIsBuffering: (isBuffering) => set({ isBuffering }),
}));
