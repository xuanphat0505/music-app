import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import { COLORS } from "@/constants/Colors";
import { PLACEHOLDER_IMAGES } from "@/constants/Images";
import React, { useState } from "react";
import { RecentSearchEntity } from "@/types";
import { Feather } from "@expo/vector-icons";

interface RecentSearchProps {
  recentSearches: RecentSearchEntity[];
  handleClearAll: () => void;
  handleSelectRecent: (item: RecentSearchEntity) => void;
  handleRemoveOne: (id: string) => void;
}

export const RecentSearch: React.FC<RecentSearchProps> = ({
  recentSearches = [],
  handleClearAll,
  handleSelectRecent,
  handleRemoveOne,
}: RecentSearchProps) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getFallbackCover = (type: "song" | "artist" | "album") => {
    if (type === "artist") return PLACEHOLDER_IMAGES.ARTIST;
    if (type === "album") return PLACEHOLDER_IMAGES.ALBUM;
    return PLACEHOLDER_IMAGES.SONG;
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleClearAll}>
          <Text style={styles.clearAllButton}>CLEAR ALL</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentList}>
        {recentSearches.map((item) => {
          const hasError = imageErrors[item.id];
          const imageUri =
            item.imageUrl && item.imageUrl.trim() !== "" && !hasError
              ? item.imageUrl
              : getFallbackCover(item.type);

          const isArtist = item.type === "artist";

          return (
            <View key={item.id} style={styles.recentItemWrapper}>
              <TouchableOpacity
                style={styles.clickableArea}
                activeOpacity={0.7}
                onPress={() => handleSelectRecent(item)}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={[
                    styles.cover,
                    isArtist ? styles.circularCover : styles.roundedCover,
                  ]}
                  onError={() => setImageErrors((prev) => ({ ...prev, [item.id]: true }))}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                activeOpacity={0.7}
                onPress={() => handleRemoveOne(item.id)}
              >
                <Feather name="x" size={18} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  clearAllButton: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    fontFamily: "Inter",
    letterSpacing: 0.5,
  },
  recentList: {
    gap: 12,
  },
  recentItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
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
    backgroundColor: COLORS.SURFACE,
  },
  circularCover: {
    borderRadius: 24,
  },
  roundedCover: {
    borderRadius: 8,
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
  subtitle: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  removeButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default RecentSearch;
