import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { SongItem } from "../common";
import * as Haptics from "expo-haptics";
import { Track } from "@/types";

interface SearchResultsProps {
  results: Track[];
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
}) => {
  const playTrack = usePlayerStore((state) => state.playTrack);

  // Hàm kích hoạt phát bài nhạc được nhấn và phản hồi xúc giác rung nhẹ
  const handlePlaySong = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
  };

  if (results.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Feather
          name="search"
          size={48}
          color={COLORS.TEXT_SECONDARY}
          style={styles.noResultsIcon}
        />
        <Text style={styles.noResultsTitle}>No results found</Text>
        <Text style={styles.noResultsSubtitle}>
          {`We couldn't find any tracks matching "${searchQuery}"`}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Songs</Text>
      {results.map((song) => {
        return (
          <SongItem
            key={song._id}
            song={song}
            onPress={() => handlePlaySong(song)}
            duration={song.duration}
            onAddPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              Alert.alert(
                "Add to Playlist",
                `Thêm "${song.title}" vào danh sách phát. Chức năng đang được phát triển.`,
              );
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 16,
  },
  moreButton: {
    padding: 8,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    marginTop: 60,
  },
  noResultsIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
    lineHeight: 18,
  },
});
