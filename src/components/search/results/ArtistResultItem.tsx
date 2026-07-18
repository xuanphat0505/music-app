import React, { useState } from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { PLACEHOLDER_IMAGES } from "@/constants/Images";
import { Artist } from "@/types";

interface ArtistResultItemProps {
  artist: Artist;
  variant: "horizontal" | "vertical";
  onPress: () => void;
}

export const ArtistResultItem: React.FC<ArtistResultItemProps> = ({
  artist,
  variant,
  onPress,
}) => {
  const [hasError, setHasError] = useState(false);

  const avatarUri =
    artist.avatar && artist.avatar.trim() !== "" && !hasError
      ? artist.avatar
      : PLACEHOLDER_IMAGES.ARTIST;

  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        style={styles.artistCardHorizontal}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Image
          source={{ uri: avatarUri }}
          style={styles.artistAvatarHorizontal}
          onError={() => setHasError(true)}
        />
        <Text style={styles.artistNameHorizontal} numberOfLines={1}>
          {artist.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.artistListItem}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image
        source={{ uri: avatarUri }}
        style={styles.artistListAvatar}
        onError={() => setHasError(true)}
      />
      <View style={styles.artistListInfo}>
        <Text style={styles.artistListName}>{artist.name}</Text>
        <Text style={styles.artistListSub}>Artist</Text>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.TEXT_SECONDARY} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  artistCardHorizontal: {
    alignItems: "center",
    marginRight: 16,
    width: 100,
  },
  artistAvatarHorizontal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.SURFACE,
    marginBottom: 8,
  },
  artistNameHorizontal: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter",
    textAlign: "center",
    width: "100%",
  },
  artistListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    marginBottom: 8,
  },
  artistListAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.SURFACE,
    marginRight: 16,
  },
  artistListInfo: {
    flex: 1,
  },
  artistListName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  artistListSub: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
});
