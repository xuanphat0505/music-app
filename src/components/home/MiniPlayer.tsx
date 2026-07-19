import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "../common";
import { usePlayerStore } from "@/store/playerStore";
import { formatArtistNames } from "@/utils/artist";

// Thành phần trình phát nhạc thu nhỏ thiết kế theo phong cách Caziq frosted glass
export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    isBuffering,
    togglePlay,
    setIsFullPlayerVisible,
    stopTrack,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <View style={styles.outerContainer}>
      <GlassView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.trackPressArea}
            activeOpacity={0.8}
            onPress={() => setIsFullPlayerVisible(true)}
          >
            <Image source={{ uri: currentTrack.artwork }} style={styles.cover} />

            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {formatArtistNames(currentTrack.artists)}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.controls}>
            {isBuffering ? (
              <View style={styles.iconButton}>
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              </View>
            ) : (
              <TouchableOpacity activeOpacity={0.8} onPress={togglePlay} style={styles.iconButton}>
                <Feather
                  name={isPlaying ? "pause" : "play"}
                  size={22}
                  color={COLORS.PRIMARY}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={stopTrack}>
              <Feather
                name="x"
                size={20}
                color="rgba(255, 255, 255, 0.3)"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thanh tiến trình màu cam san hô ở đáy MiniPlayer */}
        <View style={styles.progressBarBackground}>
          <View
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
    bottom: 60, // Nằm trên thanh Bottom Tab Bar
    left: 0,
    right: 0,
    zIndex: 99,
  },
  container: {
    backgroundColor: "rgba(24, 24, 28, 0.75)",
    borderRadius: 0,
    borderWidth: 0,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  trackPressArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND,
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
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.PRIMARY,
  },
});
export default MiniPlayer;


