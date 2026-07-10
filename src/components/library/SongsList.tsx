import React from "react";
import { StyleSheet, View } from "react-native";
import { SongItem } from "../common";
import { Track } from "@/types";

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
          key={song.id}
          song={song}
          subtitle={
            song.plays ? `${song.artist} • ${song.plays} plays` : song.artist
          }
          duration={song.duration}
          isAdded={addedSongs.includes(song.id)}
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
