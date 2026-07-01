import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "../common";
import { Track, usePlayerStore } from "@/store/playerStore";

interface TrendingSongRowProps {
  song: Track;
  plays: string;
}

// Dòng hiển thị bài hát xu hướng nằm trong hộp kính mờ hỗ trợ tương tác yêu thích và phát nhạc nhanh
export const TrendingSongRow: React.FC<TrendingSongRowProps> = ({
  song,
  plays,
}) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [isLiked, setIsLiked] = useState(false);

  const isActive = currentTrack?.id === song.id;

  return (
    <GlassView
      style={[styles.container, isActive ? styles.activeContainer : undefined]}
    >
      <TouchableOpacity
        style={styles.clickableArea}
        activeOpacity={0.7}
        onPress={() => playTrack(song)}
      >
        <Image source={{ uri: song.coverUrl }} style={styles.cover} />
        <View style={styles.infoContainer}>
          <Text
            style={[styles.title, isActive && styles.activeTitle]}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {song.artist} • {plays} plays
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => setIsLiked(!isLiked)}
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <Feather
            name={isLiked ? "heart" : "heart"}
            size={18}
            color={isLiked ? COLORS.SECONDARY : COLORS.TEXT_PRIMARY}
            style={isLiked && styles.likedIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Feather name="more-vertical" size={18} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  activeContainer: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
  },
  clickableArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  activeTitle: {
    color: COLORS.PRIMARY,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    padding: 8,
  },
  likedIcon: {
    // Nếu thích thì tô màu và hiệu ứng
  },
});
export default TrendingSongRow;
