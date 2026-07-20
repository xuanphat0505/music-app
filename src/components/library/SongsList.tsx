import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SongItem } from "../common";
import { Track } from "@/types";
import { formatArtistNames } from "@/utils/artist";
import { COLORS } from "@/constants/Colors";

interface SongsListProps {
  songs: Track[];
  addedSongs: string[];
  onPlaySong: (song: Track) => void;
  onToggleAddSong: (song: Track) => void;
  isFetchingNextPage?: boolean;
}

// Component hiển thị danh sách bài hát với hỗ trợ loading footer khi phân trang
export const SongsList: React.FC<SongsListProps> = ({
  songs,
  addedSongs,
  onPlaySong,
  onToggleAddSong,
  isFetchingNextPage = false,
}) => {
  return (
    <View style={styles.songsList}>
      {songs.map((song) => (
        <SongItem
          key={song._id}
          song={song}
          subtitle={formatArtistNames(song.artists)}
          duration={song.duration}
          isAdded={addedSongs.includes(song._id)}
          onPress={() => onPlaySong(song)}
          onAddPress={() => onToggleAddSong(song)}
        />
      ))}
      {isFetchingNextPage && (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  songsList: {
    paddingHorizontal: 20,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
