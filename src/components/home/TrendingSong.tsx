import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { SongContainer } from "../common";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";

interface TrendingSongProps {
  song: Track;
  plays: string;
}

// Dòng hiển thị bài hát xu hướng hỗ trợ tương tác yêu thích và phát nhạc nhanh
export const TrendingSong: React.FC<TrendingSongProps> = ({ song, plays }) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [isLiked, setIsLiked] = useState(false);

  // Tạo phần nút hành động yêu thích và thêm tùy chọn ở góc phải của dòng bài hát
  const rightElement = (
    <>
      <TouchableOpacity
        onPress={() => setIsLiked(!isLiked)}
        style={styles.actionButton}
        activeOpacity={0.8}
      >
        <Feather
          name="heart"
          size={18}
          color={isLiked ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
        <Feather name="more-vertical" size={18} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>
    </>
  );

  return (
    <SongContainer
      song={song}
      subtitle={`${song.artist} • ${plays} plays`}
      rightElement={rightElement}
      style={styles.rowMargin}
      onPress={() => playTrack(song)}
    />
  );
};

const styles = StyleSheet.create({
  rowMargin: {
    marginHorizontal: 20,
  },
  actionButton: {
    padding: 8,
  },
});

export default TrendingSong;

