import React from "react";
import { StyleSheet, Alert } from "react-native";
import { SongItem } from "../common";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";
import * as Haptics from "expo-haptics";

interface TrendingSongProps {
  song: Track;
  plays: string;
}

// Dòng hiển thị bài hát xu hướng hỗ trợ tương tác và phát nhạc nhanh
export const TrendingSong: React.FC<TrendingSongProps> = ({ song, plays }) => {
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <SongItem
      song={song}
      subtitle={`${song.artist} • ${plays} plays`}
      duration={song.duration}
      style={styles.rowMargin}
      onPress={() => playTrack(song)}
      onAddPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        Alert.alert(
          "Add to Playlist",
          `Thêm "${song.title}" vào danh sách phát. Chức năng đang được phát triển.`,
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  rowMargin: {
    marginHorizontal: 20,
  },
});

export default TrendingSong;
