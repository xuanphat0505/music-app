import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Playlist } from "@/types";

interface PlaylistCardProps {
  playlist: Playlist;
  onPress: () => void;
  onLongPress?: () => void;
  size?: number;
}

// Component thẻ hiển thị danh sách phát cá nhân hỗ trợ ghép lưới ảnh bìa 2x2
export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onPress,
  onLongPress,
  size,
}) => {
  // Hàm hiển thị ảnh bìa ghép lưới 2x2 hoặc ảnh đơn hoặc biểu tượng nhạc mặc định
  const renderCover = () => {
    const s = size || 140;
    const gridImgSize = s / 2;
    if (playlist.coverUrls && playlist.coverUrls.length >= 4) {
      return (
        <View style={[styles.gridContainer, { width: s, height: s }]}>
          {playlist.coverUrls.slice(0, 4).map((url, idx) => (
            <Image key={idx} source={{ uri: url }} style={{ width: gridImgSize, height: gridImgSize }} />
          ))}
        </View>
      );
    }

    const firstCover = playlist.coverUrls?.[0];
    if (firstCover) {
      return (
        <Image source={{ uri: firstCover }} style={[styles.singleImage, { width: s, height: s }]} />
      );
    }

    return (
      <View style={[styles.fallbackCover, { width: s, height: s }]}>
        <Feather name="music" size={s * 0.23} color={COLORS.TEXT_SECONDARY} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { width: size || 140, marginRight: size ? 0 : 16 }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      {renderCover()}
      <Text style={styles.playlistTitle} numberOfLines={1}>
        {playlist.title}
      </Text>
      <Text style={styles.playlistSubtitle} numberOfLines={1}>
        {playlist.description}
      </Text>
    </TouchableOpacity>
  );
};

interface AddPlaylistCardProps {
  onPress: () => void;
  size?: number;
}

export const AddPlaylistCard: React.FC<AddPlaylistCardProps> = ({
  onPress,
  size,
}) => {
  const s = size || 140;
  return (
    <TouchableOpacity
      style={[styles.cardContainer, { width: s, marginRight: size ? 0 : 16 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.addCover, { width: s, height: s }]}>
        <Feather name="plus" size={s * 0.23} color={COLORS.TEXT_SECONDARY} />
      </View>
      <Text style={styles.playlistTitle} numberOfLines={1}>
        Create Playlist
      </Text>
      <Text style={styles.playlistSubtitle} numberOfLines={1}>
        New compilation
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 140,
    marginRight: 16,
  },
  gridContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: COLORS.SURFACE,
    marginBottom: 8,
  },
  gridImage: {
    width: 70,
    height: 70,
  },
  singleImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.SURFACE,
  },
  fallbackCover: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: COLORS.SURFACE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  addCover: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
    borderStyle: "dashed",
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  playlistSubtitle: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
});
