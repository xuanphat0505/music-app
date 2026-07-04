import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";

// Thành phần lưới hiển thị sáu bài hát vừa phát gần nhất giúp truy cập nhanh trên trang chủ
export const RecentPlayGrid: React.FC = () => {
  const { recentlyPlayed, playTrack } = usePlayerStore();

  // Hàm xử lý kích hoạt rung phản hồi và phát nhạc khi người dùng bấm chọn một bài hát
  const handlePress = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
  };

  return (
    <View style={styles.container}>
      {recentlyPlayed.map((track) => (
        <TouchableOpacity
          key={track.id}
          style={styles.gridItem}
          activeOpacity={0.8}
          onPress={() => handlePress(track)}
        >
          <Image source={{ uri: track.coverUrl }} style={styles.coverImage} />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {track.title}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  coverImage: {
    width: 55,
    height: 55,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
    lineHeight: 14,
  },
});
