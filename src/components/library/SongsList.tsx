import React from "react";
import { StyleSheet, View } from "react-native";
import { SongItem } from "../common";
import { Track } from "@/types";
import { formatArtistNames } from "@/utils/artist";

interface SongsListProps {
  songs: Track[];
  addedSongs: string[];
  onPlaySong: (song: Track) => void;
  onToggleAddSong: (song: Track) => void;
}

// Component hiển thị danh sách bài hát với chức năng phát và thêm nhanh
export const SongsList: React.FC<SongsListProps> = ({
  songs,
  addedSongs,
  onPlaySong,
  onToggleAddSong,
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
    </View>
  );
};

const styles = StyleSheet.create({
  songsList: {
    paddingHorizontal: 20,
  },
});
