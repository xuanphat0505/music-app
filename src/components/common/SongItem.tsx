import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";

// Hàm định dạng số giây sang dạng phút:giây (ví dụ: 3:45)
const formatDuration = (sec: number | string) => {
  if (typeof sec === "string") return sec;
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Component dùng chung hiển thị một dòng thông tin bài hát có thời lượng bắt buộc
export const SongItem: React.FC<SongItemProps> = ({
  song,
  subtitle,
  style,
  onPress,
  duration,
  onAddPress,
  isAdded = false,
}) => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isActive = currentTrack?.id === song.id;

  return (
    <View
      style={[
        styles.container,
        isActive ? styles.activeContainer : undefined,
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.clickableArea}
        activeOpacity={0.7}
        onPress={onPress}
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
            {subtitle || song.artist}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        {onAddPress && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPress}
            activeOpacity={0.7}
          >
            {isAdded ? (
              <Ionicons name="checkmark-circle" size={20} color="#1db954" />
            ) : (
              <Feather name="plus-circle" size={20} color={COLORS.TEXT_SECONDARY} />
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.durationText}>{formatDuration(duration)}</Text>
      </View>
    </View>
  );
};

interface SongItemProps {
  song: Track;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  duration: string | number;
  onAddPress?: () => void;
  isAdded?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: COLORS.SURFACE,
  },
  activeContainer: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    backgroundColor: "rgba(255, 90, 20, 0.1)",
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
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  addButton: {
    padding: 6,
  },
  durationText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    minWidth: 32,
    textAlign: "right",
  },
});
