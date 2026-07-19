import {
  createAudioPlayer,
  AudioPlayer,
  setAudioModeAsync,
  AudioStatus,
} from "expo-audio";
import { Track } from "@/types";
import { usePlayerStore } from "@/store/playerStore";
import { getAccessToken } from "@/services/tokenService";
import { BASE_URL } from "@/apis/endpoints";
import { musicApi } from "@/apis/musicApi";

// Lớp dịch vụ quản lý phát nhạc đóng gói thực thể trình phát AudioPlayer từ expo-audio
export class AudioService {
  private static instance: AudioService | null = null;
  private sound: AudioPlayer | null = null;
  private statusSubscription: any = null;
  private isAudioModeSet = false;

  // Lấy thực thể duy nhất của lớp dịch vụ theo mẫu thiết kế Singleton
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  // Đồng bộ trạng thái chơi hoặc tạm dừng nhạc thực tế với kho lưu trữ store
  public async syncPlayState(isPlaying: boolean) {
    if (!this.sound) return;
    try {
      if (this.sound.isLoaded) {
        if (isPlaying && !this.sound.playing) {
          this.sound.play();
        } else if (!isPlaying && this.sound.playing) {
          this.sound.pause();
        }
      }
    } catch {
      // bỏ qua lỗi đồng bộ trạng thái phát nhạc
    }
  }

  // Hàm khởi tạo đăng ký theo dõi trạng thái thay đổi bài hát từ store để điều phối phát nhạc
  private constructor() {
    let lastTrackId: string | null = null;
    let lastSpotifyId: string | null = null;
    let lastIsPlaying = false;
    let hasTrack = false;

    usePlayerStore.subscribe((state) => {
      const currentTrack = state.currentTrack;
      const isPlaying = state.isPlaying;

      const trackChanged =
        currentTrack &&
        (!hasTrack ||
          (currentTrack._id !== undefined &&
            currentTrack._id !== lastTrackId) ||
          (currentTrack.spotifyId !== undefined &&
            currentTrack.spotifyId !== lastSpotifyId));

      if (currentTrack && trackChanged) {
        lastTrackId = currentTrack._id || null;
        lastSpotifyId = currentTrack.spotifyId || null;
        lastIsPlaying = isPlaying;
        hasTrack = true;
        this.loadAndPlay(currentTrack).catch(() => {});
      } else if (currentTrack && isPlaying !== lastIsPlaying) {
        lastIsPlaying = isPlaying;
        this.syncPlayState(isPlaying).catch(() => {});
      } else if (!currentTrack && hasTrack) {
        lastTrackId = null;
        lastSpotifyId = null;
        lastIsPlaying = false;
        hasTrack = false;
        this.stop().catch(() => {});
      }
    });
  }

  // Cấu hình các thiết lập âm thanh hệ thống để chạy ngầm và phát khi máy ở chế độ im lặng
  private async setupAudioMode() {
    if (this.isAudioModeSet) return;
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        shouldPlayInBackground: true,
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
      });
      this.isAudioModeSet = true;
    } catch {
      // bỏ qua lỗi cấu hình trên môi trường không hỗ trợ native
    }
  }

  // Tải luồng nhạc trực tuyến từ máy chủ và bắt đầu phát nhạc qua trình phát
  public async loadAndPlay(track: Track) {
    try {
      const { setIsBuffering } = usePlayerStore.getState();
      setIsBuffering(true);
      await this.setupAudioMode();

      if (this.statusSubscription) {
        this.statusSubscription.remove();
        this.statusSubscription = null;
      }
      if (this.sound) {
        try {
          this.sound.pause();
        } catch {}
        this.sound.remove();
        this.sound = null;
      }

      const token = getAccessToken();
      const streamUri = `${BASE_URL}/songs/stream/${track.youtubeVideoId || track.spotifyId}`;

      const player = createAudioPlayer(
        {
          uri: streamUri,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { updateInterval: 500 },
      );

      this.sound = player;

      this.statusSubscription = player.addListener(
        "playbackStatusUpdate",
        this.onPlaybackStatusUpdate.bind(this),
      );

      player.play();

      musicApi.playSong(track._id!).catch(() => {});
    } catch (error) {
      console.error("[AudioService] Lỗi khi loadAndPlay:", error);
      const { setIsBuffering } = usePlayerStore.getState();
      setIsBuffering(false);
    }
  }

  // Chuyển đổi trạng thái hoạt động giữa tạm dừng và tiếp tục phát nhạc
  public async togglePlay() {
    if (!this.sound) return;
    try {
      if (this.sound.isLoaded) {
        if (this.sound.playing) {
          this.sound.pause();
        } else {
          this.sound.play();
        }
      }
    } catch {
      // bỏ qua lỗi khi thay đổi trạng thái phát nhạc
    }
  }

  // Tua tiến trình phát bài hát đến vị trí thời gian cụ thể tính bằng giây
  public async seekTo(seconds: number) {
    if (!this.sound) return;
    try {
      await this.sound.seekTo(seconds);
    } catch {
      // bỏ qua lỗi khi tua thời gian phát nhạc
    }
  }

  // Dừng phát nhạc hiện tại và giải phóng các tài nguyên trình phát để tiết kiệm bộ nhớ
  public async stop() {
    try {
      const { setIsBuffering } = usePlayerStore.getState();
      setIsBuffering(false);

      if (this.statusSubscription) {
        this.statusSubscription.remove();
        this.statusSubscription = null;
      }
      if (this.sound) {
        try {
          this.sound.pause();
        } catch {}
        this.sound.remove();
        this.sound = null;
      }
    } catch {
      // bỏ qua lỗi giải phóng bộ nhớ
    }
  }

  // Nhận các thông tin cập nhật trạng thái hoạt động thực tế từ trình phát nhạc
  private onPlaybackStatusUpdate(status: AudioStatus) {
    const { setProgress, setDuration, setIsBuffering } =
      usePlayerStore.getState();

    setIsBuffering(status.isBuffering);

    if (!status.isLoaded) {
      return;
    }

    const progressSeconds = Math.floor(status.currentTime);
    const durationSeconds = Math.floor(status.duration ? status.duration : 0);

    setProgress(progressSeconds);
    if (durationSeconds > 0) {
      setDuration(durationSeconds);
    }

    if (status.didJustFinish) {
      this.handlePlaybackFinished().catch(() => {});
    }
  }

  // Xử lý thiết lập lại trạng thái khi bài hát phát hết thời lượng
  private async handlePlaybackFinished() {
    const { togglePlay, setProgress, setIsBuffering } =
      usePlayerStore.getState();
    setIsBuffering(false);
    setProgress(0);
    togglePlay();
    if (this.sound) {
      try {
        await this.sound.seekTo(0);
        this.sound.pause();
      } catch {
        // bỏ qua lỗi dừng phát nhạc
      }
    }
  }
}
export default AudioService;
