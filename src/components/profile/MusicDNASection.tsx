import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Artist } from "@/types";

interface MusicDNASectionProps {
  topGenres: string[];
  topArtists: Artist[];
}

// Component hiển thị thông tin sở thích âm nhạc cá nhân bao gồm thể loại và nghệ sĩ được nghe nhiều nhất
export const MusicDNASection: React.FC<MusicDNASectionProps> = ({
  topGenres,
  topArtists,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MUSIC DNA</Text>
        <View style={styles.genresGrid}>
          {topGenres.map((genre, index) => (
            <View key={index} style={styles.genrePill}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TOP ARTISTS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.artistsScroll}
        >
          {topArtists.map((artist) => (
            <View key={artist.id} style={styles.artistCard}>
              <Image source={{ uri: artist.avatarUrl }} style={styles.artistAvatar} />
              <Text style={styles.artistName} numberOfLines={1}>
                {artist.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1.5,
    fontFamily: "Outfit",
    marginBottom: 12,
  },
  genresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
  },
  genreText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.PRIMARY,
    fontFamily: "Inter",
  },
  artistsScroll: {
    gap: 16,
    paddingRight: 20,
  },
  artistCard: {
    alignItems: "center",
    width: 72,
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.SURFACE,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  artistName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
    textAlign: "center",
  },
});
