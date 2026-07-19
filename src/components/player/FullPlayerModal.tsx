import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { CDSpin, LyricsModal } from "@/components/player";
import { AudioService } from "@/services/audioService";

// Định dạng giây thành phút và giây
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Component trình phát nhạc lớn toàn màn hình dạng Modal có hiệu ứng kính mờ và điều khiển trực quan
export const FullPlayerModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    isBuffering,
    isFullPlayerVisible,
    togglePlay,
    setProgress,
    setIsFullPlayerVisible,
  } = usePlayerStore();

  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  // Reset trạng thái xem lyrics khi bài hát thay đổi
  useEffect(() => {
    setShowLyrics(false);
  }, [currentTrack?._id]);

  // Đồng bộ tiến trình bài hát từ store khi người dùng không kéo thanh trượt
  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  if (!currentTrack) return null;

  const artworkUrl =
    currentTrack.artwork ||
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300";

  // Hàm xử lý thu nhỏ màn hình phát nhạc về dạng thanh MiniPlayer dưới cùng
  const handleMinimize = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsFullPlayerVisible(false);
    setShowLyrics(false);
  };

  // Hàm xử lý khi người dùng nhấn nút chuyển tiếp hoặc quay lại bài hát
  const handleTrackNavigation = (direction: "next" | "prev") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert("Play Queue", `Navigating to ${direction} track`);
  };

  // Hàm xử lý bật/tắt nút Shuffle
  const handleToggleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsShuffle(!isShuffle);
  };

  // Hàm xử lý bật/tắt nút Repeat
  const handleToggleRepeat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsRepeat(!isRepeat);
  };

  // Hàm xử lý khi bắt đầu kéo thanh trượt
  const handleSlidingStart = () => {
    setIsDragging(true);
  };

  // Hàm xử lý khi thả tay khỏi thanh trượt để tua bài hát
  const handleSlidingComplete = (value: number) => {
    setIsDragging(false);
    setProgress(value);
    AudioService.getInstance()
      .seekTo(value)
      .catch(() => {});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <Modal
      visible={isFullPlayerVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleMinimize}
    >
      <View style={styles.container}>
        {/* Hình ảnh album nghệ thuật phóng lớn làm nền mờ động */}
        <Image
          source={{ uri: artworkUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <BlurView
          intensity={95}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Thanh tiêu đề Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleMinimize}
              activeOpacity={0.7}
            >
              <Feather
                name="chevron-down"
                size={24}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerSub}>NOW PLAYING</Text>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
            </View>

            <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
              <Feather
                name="more-vertical"
                size={24}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>
          </View>

          {/* Khu vực mâm đĩa CD xoay trung tâm */}
          <View style={styles.cdContainer}>
            <CDSpin
              coverUrl={artworkUrl}
              isPlaying={isPlaying && !isBuffering}
            />
          </View>

          {/* Thông tin tên bài hát và nghệ sĩ */}
          <View style={styles.metadataContainer}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {typeof currentTrack.artist === "string"
                ? currentTrack.artist
                : currentTrack.artist?.name}
            </Text>
          </View>

          {/* Thanh trượt tiến trình phát nhạc */}
          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={localProgress}
              minimumTrackTintColor={COLORS.PRIMARY}
              maximumTrackTintColor="rgba(255, 255, 255, 0.15)"
              thumbTintColor={COLORS.TEXT_PRIMARY}
              onSlidingStart={handleSlidingStart}
              onValueChange={setLocalProgress}
              onSlidingComplete={handleSlidingComplete}
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(localProgress)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Bộ nút điều khiển phát nhạc chính */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handleToggleShuffle} activeOpacity={0.7}>
              <Feather
                name="shuffle"
                size={22}
                color={isShuffle ? COLORS.PRIMARY : "rgba(255, 255, 255, 0.4)"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTrackNavigation("prev")}
              activeOpacity={0.7}
            >
              <Feather name="skip-back" size={26} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlay}
              activeOpacity={0.8}
              disabled={isBuffering}
            >
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playPauseButton}
              >
                {isBuffering ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Feather
                    name={isPlaying ? "pause" : "play"}
                    size={28}
                    color="#ffffff"
                    style={!isPlaying && styles.playIconOffset}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTrackNavigation("next")}
              activeOpacity={0.7}
            >
              <Feather
                name="skip-forward"
                size={26}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleToggleRepeat} activeOpacity={0.7}>
              <Feather
                name="repeat"
                size={22}
                color={isRepeat ? COLORS.PRIMARY : "rgba(255, 255, 255, 0.4)"}
              />
            </TouchableOpacity>
          </View>

          {/* Bộ nút tính năng bổ trợ ở đáy màn hình */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.footerButton}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert("Playlist", "Add song to your playlists")
              }
            >
              <Feather
                name="plus-square"
                size={18}
                color={COLORS.TEXT_SECONDARY}
              />
              <Text style={styles.footerButtonText}>Add to Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerButton}
              activeOpacity={0.7}
              onPress={() => setShowLyrics(true)}
            >
              <Feather
                name="align-left"
                size={18}
                color={COLORS.TEXT_SECONDARY}
              />
              <Text style={styles.footerButtonText}>View Lyrics</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Modal hiển thị lời bài hát với nền màu trơn riêng biệt */}
        <LyricsModal
          visible={showLyrics}
          onClose={() => setShowLyrics(false)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 2,
    fontFamily: "Outfit",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  cdContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  metadataContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    textAlign: "center",
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: -4,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  playIconOffset: {
    marginLeft: 4,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
});
