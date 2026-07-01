import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "../common";
import { usePlayerStore } from "@/store/playerStore";

// phần trình phát nhạc thu nhỏ
export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    setProgress,
  } = usePlayerStore();

  // Tạo khoảng thời gian đếm giây giả lập tiến trình phát nhạc khi đang phát
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        if (progress < duration) {
          setProgress(progress + 1);
        } else {
          setProgress(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, duration, currentTrack]);

  if (!currentTrack) return null;

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <View style={styles.outerContainer}>
      <GlassView style={styles.container}>
        <View style={styles.content}>
          <Image source={{ uri: currentTrack.coverUrl }} style={styles.cover} />

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Feather
                name="skip-forward"
                size={20}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={togglePlay}>
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playButton}
              >
                <Feather
                  name={isPlaying ? "pause" : "play"}
                  size={16}
                  color="#fff"
                  style={!isPlaying && styles.playIconOffset}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Thanh tiến trình siêu mảnh nằm dưới đáy hộp MiniPlayer */}
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 68, // Nằm trên thanh Bottom Tab Bar kiểu Spotify
    left: 10,
    right: 10,
    zIndex: 99,
  },
  container: {
    backgroundColor: "rgba(15, 19, 29, 0.75)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 6,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconOffset: {
    marginLeft: 2, // Đẩy nhẹ icon play sang phải để cân đối hình tròn
  },
  progressBarBackground: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
  },
});
export default MiniPlayer;
