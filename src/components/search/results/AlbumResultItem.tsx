import React, { useState } from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { PLACEHOLDER_IMAGES } from "@/constants/Images";
import { Album } from "@/types";

interface AlbumResultItemProps {
  album: Album;
  variant: "horizontal" | "vertical";
  onPress: () => void;
}

export const AlbumResultItem: React.FC<AlbumResultItemProps> = ({
  album,
  variant,
  onPress,
}) => {
  const [hasError, setHasError] = useState(false);

  const artworkUri =
    album.artwork && album.artwork.trim() !== "" && !hasError
      ? album.artwork
      : PLACEHOLDER_IMAGES.ALBUM;

  const artistName =
    typeof album.artist === "string" ? album.artist : album.artist?.name || "Unknown Artist";

  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        style={styles.albumCardHorizontal}
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

  return (
    <TouchableOpacity
      style={styles.albumListItem}
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
      <Feather name="chevron-right" size={20} color={COLORS.TEXT_SECONDARY} />
    </TouchableOpacity>
  );
};

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
});
