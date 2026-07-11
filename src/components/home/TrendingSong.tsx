import React from "react";
import { StyleSheet, Alert } from "react-native";
import { SongItem } from "../common";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";
import * as Haptics from "expo-haptics";
import { ENDPOINTS } from "@/apis/endpoints";
import { BASE_URL } from "@/apis/endpoints";

// Hàm định dạng số lượt nghe thành cỗi ngắn gọn (ví dụ: 1500 -> 1.5K)
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

  const artistName = typeof song.artist === "string"
    ? song.artist
    : song.artist?.name || "";

  const totalPlays = (song.playsCount || 0) + (song.audiusPlaysCount || 0);
  const playsText = formatPlays(totalPlays);

  // Đường dẫn stream đi qua NestJS server để redirect sang Audius node khỏe nhất
  const audioUrl = `${BASE_URL}${ENDPOINTS.SONGS.STREAM(song.audiusId)}`;

  return (
    <SongItem
      song={song}
      subtitle={`${artistName} • ${playsText} plays`}
      duration={song.duration}
      style={styles.rowMargin}
      onPress={() => playTrack({ ...song, audioUrl })}
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
