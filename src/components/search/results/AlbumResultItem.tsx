import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { PLACEHOLDER_IMAGES } from "@/constants/Images";
import { Playlist } from "@/types";
import {formatDuration} from '@/utils/format'

// Định nghĩa giao diện cho các tham số đầu vào của component AlbumResultItem
interface AlbumResultItemProps {
  album: Playlist;
  variant: "horizontal" | "vertical";
  onPress: () => void;
  duration?: string | number;
  isAdded?: boolean;
  onAddPress?: () => void;
  onPlaylistPress?: () => void;
  style?: StyleProp<ViewStyle>;
}


// Component hiển thị mục kết quả tìm kiếm Album hỗ trợ cấu hình ngang/dọc và các hành vi tương tác nhanh
export const AlbumResultItem: React.FC<AlbumResultItemProps> = React.memo(({
  album,
  variant,
  onPress,
  duration,
  isAdded = false,
  onAddPress,
  onPlaylistPress,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Thực hiện hiệu ứng nảy và xoay cho biểu tượng thư viện khi trạng thái thay đổi
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

  const artworkUri =
    album.artwork && album.artwork.trim() !== "" && !hasError
      ? album.artwork
      : PLACEHOLDER_IMAGES.ALBUM;

  const artistName =
    typeof album.artist === "string" ? album.artist : album.artist?.name || "Unknown Artist";

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "0deg"],
  });

  const hasRightControls =
    duration !== undefined || onAddPress !== undefined || onPlaylistPress !== undefined;

  // Trả về giao diện thẻ nằm ngang nếu variant được chọn là horizontal
  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        style={[styles.albumCardHorizontal, style]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Image
          source={{ uri: artworkUri }}
          style={styles.albumArtworkHorizontal}
          onError={() => setHasError(true)}
        />
        <Text style={styles.albumTitleHorizontal} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={styles.albumArtistHorizontal} numberOfLines={1}>
          {artistName}
        </Text>
      </TouchableOpacity>
    );
  }

  // Trả về giao diện danh sách nằm dọc mặc định
  return (
    <TouchableOpacity
      style={[styles.albumListItem, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image
        source={{ uri: artworkUri }}
        style={styles.albumListArtwork}
        onError={() => setHasError(true)}
      />
      <View style={styles.albumListInfo}>
        <Text style={styles.albumListTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={styles.albumListSub} numberOfLines={1}>
          Album • {artistName}
        </Text>
      </View>
      {hasRightControls ? (
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
          {onPlaylistPress && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onPlaylistPress}
              activeOpacity={0.7}
            >
              <Feather
                name="folder-plus"
                size={18}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          )}
          {duration !== undefined && (
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          )}
        </View>
      ) : (
        <Feather name="chevron-right" size={20} color={COLORS.TEXT_SECONDARY} />
      )}
    </TouchableOpacity>
  );
});

AlbumResultItem.displayName = "AlbumResultItem";

const styles = StyleSheet.create({
  albumCardHorizontal: {
    marginRight: 16,
    width: 110,
  },
  albumArtworkHorizontal: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    marginBottom: 8,
  },
  albumTitleHorizontal: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 2,
  },
  albumArtistHorizontal: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    fontFamily: "Inter",
  },
  albumListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    marginBottom: 8,
  },
  albumListArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    marginRight: 16,
  },
  albumListInfo: {
    flex: 1,
  },
  albumListTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  albumListSub: {
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

