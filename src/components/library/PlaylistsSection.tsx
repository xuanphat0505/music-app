import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/Colors";
import { PlaylistCard, AddPlaylistCard } from "./PlaylistCard";
import { Playlist } from "@/types";

interface PlaylistsSectionProps {
  playlists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onLongPressPlaylist: (playlist: Playlist) => void;
  onAddPlaylistPress: () => void;
}

// Component phân mục danh sách phát hiển thị tiêu đề và cuộn ngang các thẻ danh sách phát cá nhân
export const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({
  playlists,
  onSelectPlaylist,
  onLongPressPlaylist,
  onAddPlaylistPress,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Playlists</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>SEE ALL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.playlistScroll}
      >
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onPress={() => onSelectPlaylist(playlist)}
            onLongPress={() => onLongPressPlaylist(playlist)}
          />
        ))}
        <AddPlaylistCard onPress={onAddPlaylistPress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    fontFamily: "Outfit",
  },
  playlistScroll: {
    paddingHorizontal: 20,
  },
});
