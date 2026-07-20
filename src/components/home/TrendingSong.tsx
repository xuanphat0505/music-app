import React from "react";
import { StyleSheet } from "react-native";
import { SongItem } from "../common";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";
import * as Haptics from "expo-haptics";
import { formatArtistNames } from "@/utils/artist";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";

// Hàm định dạng số lượt nghe thành chuỗi ngắn gọn (ví dụ: 1500 -> 1.5K)
const formatPlays = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
};

interface TrendingSongProps {
  song: Track;
}

// Dòng hiển thị bài hát xu hướng hỗ trợ tương tác và phát nhạc nhanh
export const TrendingSong: React.FC<TrendingSongProps> = ({ song }) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const { isSongInLibrary, toggleSong } = useLibrarySongs();

  const artistName = formatArtistNames(song.artists);

  const totalPlays = (song.playsCount || 0) + (song.spotifyPlaysCount || 0);
  const playsText = formatPlays(totalPlays);

  return (
    <SongItem
      song={song}
      subtitle={`${artistName} • ${playsText} plays`}
      duration={song.duration}
      style={styles.rowMargin}
      isAdded={isSongInLibrary(song._id)}
      onPress={() => playTrack(song)}
      onAddPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        toggleSong(song);
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
