import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";
import { formatArtistNames } from "@/utils/artist";

// Hàm định dạng số giây sang dạng phút:giây (ví dụ: 3:45)
const formatDuration = (sec: number | string) => {
  if (typeof sec === "string") return sec;
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Component dùng chung hiển thị một dòng thông tin bài hát có thời lượng bắt buộc
export const SongItem: React.FC<SongItemProps> = React.memo(({
  song,
  subtitle,
  style,
  onPress,
  duration,
  onAddPress,
  isAdded = false,
}) => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Thực hiện chuyển động nảy và xoay icon khi trạng thái lưu bài hát thay đổi
  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.35,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: isAdded ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isAdded, scaleAnim, rotateAnim]);

  // So sánh bài hát đang hoạt động bằng spotifyId hoặc _id từ server
  const isActive = !!(
    currentTrack &&
    (currentTrack._id === song._id || currentTrack.spotifyId === song.spotifyId)
  );

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [song._id, song.artwork]);

  const artworkUrl =
    song.artwork && song.artwork.trim() !== "" && !imageError
      ? song.artwork
      : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300";

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "0deg"],
  });

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
        <Image
          source={{ uri: artworkUrl }}
          style={styles.cover}
          onError={() => setImageError(true)}
        />
        <View style={styles.infoContainer}>
          <Text
            style={[styles.title, isActive && styles.activeTitle]}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle || formatArtistNames(song.artists)}
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
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }, { rotate: spin }],
              }}
            >
              {isAdded ? (
                <Ionicons name="checkmark-circle" size={20} color="#1db954" />
              ) : (
                <Feather
                  name="plus-circle"
                  size={20}
                  color={COLORS.TEXT_SECONDARY}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        )}
        <Text style={styles.durationText}>{formatDuration(duration)}</Text>
      </View>
    </View>
  );
});

interface SongItemProps {
  song: Track | any;
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

SongItem.displayName = "SongItem";

