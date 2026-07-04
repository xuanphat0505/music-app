import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  recentlyPlayed: Track[];
  isFullPlayerVisible: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsFullPlayerVisible: (visible: boolean) => void;
}

const MOCK_RECENT_TRACKS: Track[] = [
  {
    id: 's1',
    title: 'Velocity',
    artist: 'Pulse Engine',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: 's2',
    title: 'Midnight Blue',
    artist: 'Azure Dreams',
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=150&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 423,
  },
  {
    id: 's3',
    title: 'Fractured',
    artist: 'Digital Void',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=150&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 344,
  },
  {
    id: 's4',
    title: 'Starlight Drift',
    artist: 'Orion',
    coverUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=150&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 302,
  },
  {
    id: 'a1',
    title: 'Neon Nights',
    artist: 'Various Artists',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 250,
  },
  {
    id: 'a2',
    title: 'Cyber Echoes',
    artist: 'LUN',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 280,
  },
];

// Khởi tạo kho lưu trữ trạng thái phát nhạc toàn cục của ứng dụng giúp điều phối hoạt động phát nhạc
export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  recentlyPlayed: MOCK_RECENT_TRACKS,
  isFullPlayerVisible: false,

  // Hàm kích hoạt phát một bài hát mới và thiết lập lại các thông số thời gian cùng danh sách phát gần đây
  playTrack: (track) => set((state) => {
    // Loại bỏ bài hát trùng lặp trong lịch sử cũ
    const filtered = state.recentlyPlayed.filter((t) => t.id !== track.id);
    // Chèn bài hát mới lên đầu danh sách và giới hạn tối đa sáu phần tử
    const updatedList = [track, ...filtered].slice(0, 6);
    return {
      currentTrack: track,
      isPlaying: true,
      progress: 0,
      duration: track.duration,
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
}));
