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

// Component thẻ hiển thị danh sách phát cá nhân và album dùng chung trên toàn ứng dụng
export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onPress,
  onLongPress,
  size,
}) => {
  // Hàm hiển thị ảnh bìa ghép lưới động hoặc ảnh đơn hoặc biểu tượng nhạc mặc định
  const renderCover = () => {
    const s = size || 140;
    const gap = 1.5;

    // Tự động fallback về ảnh bìa đơn của Album nếu danh sách coverUrls của Playlist bị trống
    const coverUrls = playlist.coverUrls && playlist.coverUrls.length > 0
      ? playlist.coverUrls
      : (playlist.artwork ? [playlist.artwork] : []);

    if (coverUrls.length === 0) {
      return (
        <View style={[styles.fallbackCover, { width: s, height: s }]}>
          <Feather name="music" size={s * 0.23} color={COLORS.TEXT_SECONDARY} />
        </View>
      );
    }

    const len = coverUrls.length;

    // Trường hợp từ 4 bài hát trở lên: lưới 2x2
    if (len >= 4) {
      const gridImgSize = (s - gap) / 2;
      return (
        <View style={[styles.gridContainer, { width: s, height: s, gap }]}>
          {coverUrls.slice(0, 4).map((url, idx) => (
            <Image
              key={idx}
              source={{ uri: url }}
              style={{ width: gridImgSize, height: gridImgSize }}
              resizeMode="cover"
            />
          ))}
        </View>
      );
    }

    // Trường hợp 3 bài hát: 1 ảnh dọc bên trái, 2 ảnh nhỏ chồng bên phải
    if (len === 3) {
      const leftWidth = (s - gap) / 2;
      const rightWidth = (s - gap) / 2;
      const rightHeight = (s - gap) / 2;
      return (
        <View style={[styles.collageContainer, { width: s, height: s, gap }]}>
          <Image
            source={{ uri: coverUrls[0] }}
            style={{ width: leftWidth, height: s }}
            resizeMode="cover"
          />
          <View style={[styles.rightColumn, { width: rightWidth, gap }]}>
            <Image
              source={{ uri: coverUrls[1] }}
              style={{ width: rightWidth, height: rightHeight }}
              resizeMode="cover"
            />
            <Image
              source={{ uri: coverUrls[2] }}
              style={{ width: rightWidth, height: rightHeight }}
              resizeMode="cover"
            />
          </View>
        </View>
      );
    }

    // Trường hợp 2 bài hát: chia đôi theo chiều dọc
    if (len === 2) {
      const halfWidth = (s - gap) / 2;
      return (
        <View style={[styles.collageContainer, { width: s, height: s, gap }]}>
          <Image
            source={{ uri: coverUrls[0] }}
            style={{ width: halfWidth, height: s }}
            resizeMode="cover"
          />
          <Image
            source={{ uri: coverUrls[1] }}
            style={{ width: halfWidth, height: s }}
            resizeMode="cover"
          />
        </View>
      );
    }

    // Trường hợp 1 bài hát hoặc Album: hiển thị ảnh đơn
    return (
      <Image
        source={{ uri: coverUrls[0] }}
        style={[styles.singleImage, { width: s, height: s }]}
        resizeMode="cover"
      />
    );
  };

  // Xác định phụ đề (Mô tả Playlist -> Ca sĩ Album -> Số bài hát)
  const getSubtitle = () => {
    if (playlist.description) return playlist.description;
    if (playlist.artist) {
      const artist = playlist.artist;
      return typeof artist === "string" ? artist : artist?.name || "";
    }
    return `${playlist.songs?.length || 0} bài hát`;
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
        {getSubtitle()}
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
  collageContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: COLORS.SURFACE,
    marginBottom: 8,
  },
  rightColumn: {
    flexDirection: "column",
    height: "100%",
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
