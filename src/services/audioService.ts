import { Audio, AVPlaybackStatus } from "expo-av";
import { Track } from "@/types";
import { usePlayerStore } from "@/store/playerStore";
import { getAccessToken } from "@/services/tokenService";
import { BASE_URL } from "@/apis/endpoints";
import { musicApi } from "@/apis/musicApi";

// Lớp dịch vụ quản lý phát nhạc đóng gói thực thể expo-av Sound
export class AudioService {
  private static instance: AudioService | null = null;
  private sound: Audio.Sound | null = null;
  private isAudioModeSet = false;
  private isBufferLoading = false;

  // Lấy thực thể duy nhất của lớp dịch vụ (Pattern Singleton)
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  // Đồng bộ trạng thái chơi/tạm dừng nhạc thực tế với store
  public async syncPlayState(isPlaying: boolean) {
    if (!this.sound) return;
    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        if (isPlaying && !status.isPlaying) {
          await this.sound.playAsync();
        } else if (!isPlaying && status.isPlaying) {
          await this.sound.pauseAsync();
        }
      }
    } catch (error) {
      // bỏ qua lỗi đồng bộ trạng thái phát nhạc
    }
  }

  private constructor() {
    let lastTrackId: string | null = null;
    let lastIsPlaying = false;

    // Đăng ký theo dõi thay đổi từ Zustand playerStore để tự động xử lý thiết bị âm thanh native
    usePlayerStore.subscribe((state) => {
      const currentTrack = state.currentTrack;
      const isPlaying = state.isPlaying;

      if (currentTrack && currentTrack._id !== lastTrackId) {
        lastTrackId = currentTrack._id || null;
        lastIsPlaying = isPlaying;
        this.loadAndPlay(currentTrack).catch(() => {});
      } else if (currentTrack && isPlaying !== lastIsPlaying) {
        lastIsPlaying = isPlaying;
        this.syncPlayState(isPlaying).catch(() => {});
      } else if (!currentTrack && lastTrackId !== null) {
        lastTrackId = null;
        lastIsPlaying = false;
        this.stop().catch(() => {});
      }
    });
  }

  // Khởi tạo các cấu hình hệ thống âm thanh nền cho thiết bị
  private async setupAudioMode() {
    if (this.isAudioModeSet) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      });
      this.isAudioModeSet = true;
    } catch (error) {
      // bỏ qua lỗi cấu hình nếu chạy trên môi trường không hỗ trợ native
    }
  }

  // Tải luồng nhạc trực tuyến từ server và bắt đầu phát nhạc
  public async loadAndPlay(track: Track) {
    try {
      await this.setupAudioMode();

      // Giải phóng tài nguyên phát nhạc cũ nếu có bài hát đang chạy
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      const token = getAccessToken();
      const streamUri = `${BASE_URL}/songs/stream/${track.audiusId}`;

      const { sound } = await Audio.Sound.createAsync(
        {
          uri: streamUri,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { shouldPlay: true },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;

      // Gọi API ghi nhận lượt nghe nhạc trên backend theo _id
      musicApi.playSong(track._id!).catch(() => {});
    } catch (error) {
      // xử lý ngoại lệ khi tải nhạc trực tuyến thất bại
    }
  }

  // Chuyển đổi trạng thái giữa tạm dừng và tiếp tục phát nhạc
  public async togglePlay() {
    if (!this.sound) return;
    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await this.sound.pauseAsync();
        } else {
          await this.sound.playAsync();
        }
      }
    } catch (error) {
      // bỏ qua lỗi khi thay đổi trạng thái phát nhạc
    }
  }

  // Tua bài hát đến thời gian chỉ định (tính bằng giây)
  public async seekTo(seconds: number) {
    if (!this.sound) return;
    try {
      await this.sound.setPositionAsync(seconds * 1000);
    } catch (error) {
      // bỏ qua lỗi khi tua thời gian phát nhạc
    }
  }

  // Dừng phát và dọn dẹp bộ nhớ đệm âm thanh
  public async stop() {
    if (!this.sound) return;
    try {
      await this.sound.unloadAsync();
      this.sound = null;
    } catch (error) {
      // bỏ qua lỗi giải phóng bộ nhớ
    }
  }

  // Hàm nhận cập nhật trạng thái hoạt động của trình phát nhạc native từ expo-av
  private onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) {
      if (status.error) {
        // ghi nhận khi xảy ra lỗi giải mã âm thanh
      }
      return;
    }

    const { setProgress, setDuration } = usePlayerStore.getState();

    // Đổi đơn vị mili giây sang giây để đồng bộ với UI
    const progressSeconds = Math.floor(status.positionMillis / 1000);
    const durationSeconds = Math.floor(
      status.durationMillis ? status.durationMillis / 1000 : 0
    );

    setProgress(progressSeconds);
    if (durationSeconds > 0) {
      setDuration(durationSeconds);
    }

    // Tự động giải phóng tài nguyên phát nhạc và cập nhật trạng thái khi bài hát kết thúc
    if (status.didJustFinish) {
      this.handlePlaybackFinished();
    }
  }

  // Xử lý sự kiện khi bài hát kết thúc
  private async handlePlaybackFinished() {
    const { togglePlay, setProgress } = usePlayerStore.getState();
    setProgress(0);
    togglePlay();
    if (this.sound) {
      await this.sound.setPositionAsync(0);
      await this.sound.pauseAsync();
    }
  }
}
