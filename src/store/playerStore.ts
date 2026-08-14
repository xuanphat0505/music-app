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

  // Hàng đợi phát nhạc và các cài đặt phát nhạc toàn cục
  queue: Track[];
  currentIndex: number;
  isShuffle: boolean;

  playTrack: (track: Track | any) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsFullPlayerVisible: (visible: boolean) => void;
  stopTrack: () => void;
  setIsBuffering: (isBuffering: boolean) => void;
  fetchLyrics: (songId: string) => Promise<void>;
  resetLyrics: () => void;

  // Phương thức điều phối hàng đợi tái sử dụng toàn cục
  playAll: (tracks: Track[], startIndex?: number) => void;
  shufflePlay: (tracks: Track[]) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  toggleShuffle: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isRepeatEnabled: boolean;
  toggleRepeat: () => void;
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
  volume: 1.0,
  isRepeatEnabled: false,

  // Trạng thái khởi tạo hàng đợi
  queue: [],
  currentIndex: -1,
  isShuffle: false,

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
        currentLyrics: null, // Reset lời bài hát cũ
        isRepeatEnabled: false, // Tự động tắt chế độ lặp lại khi chuyển bài mới
      };
    });
  },

  // Phát toàn bộ danh sách nhạc từ vị trí bắt đầu
  playAll: (tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    const index = Math.max(0, Math.min(startIndex, tracks.length - 1));
    const targetTrack = tracks[index];

    set({
      queue: tracks,
      currentIndex: index,
    });
    get().playTrack(targetTrack);
  },

  // Phát ngẫu nhiên xáo trộn toàn bộ danh sách nhạc
  shufflePlay: (tracks) => {
    if (!tracks || tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    set({
      queue: shuffled,
      currentIndex: 0,
      isShuffle: true,
    });
    get().playTrack(shuffled[0]);
  },

  // Chuyển sang bài hát tiếp theo trong hàng đợi
  playNextTrack: () => {
    const { queue, currentIndex, isShuffle } = get();
    if (!queue || queue.length === 0) return;

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        nextIndex = 0; // Quay lại bài đầu tiên khi hết danh sách
      }
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      set({ currentIndex: nextIndex });
      get().playTrack(nextTrack);
    }
  },

  // Lùi lại bài hát trước đó trong hàng đợi
  playPrevTrack: () => {
    const { queue, currentIndex } = get();
    if (!queue || queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // Quay về bài cuối cùng khi lùi quá đầu danh sách
    }

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      set({ currentIndex: prevIndex });
      get().playTrack(prevTrack);
    }
  },

  // Bật hoặc tắt chế độ phát xáo trộn
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  // Hàm chuyển đổi trạng thái tạm dừng hoặc tiếp tục phát nhạc hiện tại
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Hàm cập nhật tiến trình phát nhạc hiện tại theo thời gian thực (chỉ update khi thay đổi > 0.05s)
  setProgress: (progress) => {
    if (Math.abs(get().progress - progress) > 0.05) {
      set({ progress });
    }
  },

  // Hàm cập nhật tổng thời lượng của bài hát đang phát (chỉ update khi giá trị thay đổi)
  setDuration: (duration) => {
    if (get().duration !== duration) {
      set({ duration });
    }
  },

  // Hàm cập nhật trạng thái hiển thị của trình phát nhạc lớn
  setIsFullPlayerVisible: (visible) => set({ isFullPlayerVisible: visible }),

  // Hàm dừng phát nhạc và đặt lại các trạng thái về ban đầu để đóng trình phát
  stopTrack: () => set({ currentTrack: null, isPlaying: false, progress: 0, duration: 0, isBuffering: false, currentLyrics: null, queue: [], currentIndex: -1 }),

  // Hàm cập nhật trạng thái đang tải hoặc buffering nhạc từ thiết bị native (chỉ update khi giá trị thay đổi)
  setIsBuffering: (isBuffering) => {
    if (get().isBuffering !== isBuffering) {
      set({ isBuffering });
    }
  },

  // Hàm tải lời bài hát bất đồng bộ từ Server và lưu vào cache của store
  fetchLyrics: async (songId) => {
    if (!songId) return; // Bảo vệ tránh gọi API với ID rỗng
    const state = get();
    // Bỏ qua nếu đang trong quá trình tải hoặc đã có lyrics của đúng bài hát này để tránh vòng lặp vô hạn
    if (state.isLyricsLoading) return;
    if (state.currentLyrics && state.currentTrack?._id === songId) return;

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

  // Hàm cập nhật âm lượng phát nhạc
  setVolume: (volume) => set({ volume }),

  // Hàm bật/tắt chế độ lặp lại bài hát hiện tại
  toggleRepeat: () => set((state) => ({ isRepeatEnabled: !state.isRepeatEnabled })),
}));
