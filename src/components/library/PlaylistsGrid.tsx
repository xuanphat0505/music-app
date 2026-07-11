import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PlaylistCard, AddPlaylistCard } from "./PlaylistCard";
import { Playlist } from "@/types";

interface PlaylistsGridProps {
  playlists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onLongPressPlaylist: (playlist: Playlist) => void;
  onAddPlaylistPress: () => void;
}

const { width } = Dimensions.get("window");
const PLAYLIST_CARD_SIZE = (width - 40 - 24) / 3;

// Component hiển thị lưới danh sách phát cá nhân và thẻ thêm mới danh sách phát
export const PlaylistsGrid: React.FC<PlaylistsGridProps> = ({
  playlists,
  onSelectPlaylist,
  onLongPressPlaylist,
  onAddPlaylistPress,
}) => {
  return (
    <View style={styles.playlistsGrid}>
      {playlists.map((playlist) => (
        <View key={playlist._id} style={styles.playlistGridItem}>
          <PlaylistCard
            playlist={playlist}
            onPress={() => onSelectPlaylist(playlist)}
            onLongPress={() => onLongPressPlaylist(playlist)}
            size={PLAYLIST_CARD_SIZE}
          />
        </View>
      ))}
      <View style={styles.playlistGridItem}>
        <AddPlaylistCard
          onPress={onAddPlaylistPress}
          size={PLAYLIST_CARD_SIZE}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playlistsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  playlistGridItem: {
    width: PLAYLIST_CARD_SIZE,
    marginBottom: 16,
  },
});
