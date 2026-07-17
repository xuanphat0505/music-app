import React, { useMemo, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { parseLrc, LrcLine } from "@/utils/lrcParser";
import { AudioService } from "@/services/audioService";

// Component hiển thị danh sách lời bài hát cuộn đồng bộ Karaoke hoặc tĩnh
export const LyricsView: React.FC = () => {
  const {
    currentTrack,
    currentLyrics,
    isLyricsLoading,
    progress,
    setProgress,
    fetchLyrics,
  } = usePlayerStore();

  const flatListRef = useRef<FlatList<LrcLine>>(null);

  // Tự động gọi API lấy lyrics nếu chưa có trong cache store
  useEffect(() => {
    if (currentTrack && !currentLyrics && !isLyricsLoading) {
      fetchLyrics(currentTrack._id).catch(() => {});
    }
  }, [currentTrack, currentLyrics, isLyricsLoading, fetchLyrics]);

  // Phân tích cú pháp chuỗi LRC thô sang mảng đối tượng câu hát
  const parsedLines = useMemo(() => {
    return currentLyrics?.syncedLyrics ? parseLrc(currentLyrics.syncedLyrics) : [];
  }, [currentLyrics?.syncedLyrics]);

  // Xác định dòng lời bài hát đang được phát tại thời điểm hiện tại
  const progressMs = progress * 1000;
  const activeIndex = useMemo(() => {
    if (parsedLines.length === 0) return -1;
    return parsedLines.findIndex((line, index) => {
      const nextLine = parsedLines[index + 1];
      return progressMs >= line.time && (!nextLine || progressMs < nextLine.time);
    });
  }, [parsedLines, progressMs]);

  // Tự động cuộn dòng lời hát đang phát vào chính giữa vùng hiển thị
  useEffect(() => {
    if (activeIndex >= 0 && flatListRef.current) {
      try {
        flatListRef.current.scrollToIndex({
          index: activeIndex,
          viewPosition: 0.3, // Định vị dòng hát ở vị trí 30% từ trên xuống
          animated: true,
        });
      } catch {
        // Bỏ qua lỗi cuộn khi danh sách chưa tải xong layout
      }
    }
  }, [activeIndex]);

  // Xử lý tua nhạc tới vị trí thời gian của câu hát được chọn
  const handleLinePress = (timeMs: number) => {
    const seconds = timeMs / 1000;
    setProgress(seconds);
    AudioService.getInstance().seekTo(seconds).catch(() => {});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Trạng thái đang tải dữ liệu
  if (isLyricsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải lời bài hát...</Text>
      </View>
    );
  }

  // Trạng thái không có bất kỳ dữ liệu lời bài hát nào
  if (!currentLyrics || (!currentLyrics.lyrics && !currentLyrics.syncedLyrics)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>🎵 Lời bài hát chưa được cập nhật</Text>
      </View>
    );
  }

  // Trường hợp 1: Có lời bài hát đồng bộ (LRC Karaoke)
  if (currentLyrics.syncedLyrics && parsedLines.length > 0) {
    return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={parsedLines}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={(_, index) => ({
            length: 65, // Ước lượng chiều cao của mỗi hàng lời bài hát
            offset: 65 * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            // Xử lý khi cuộn thất bại do phần tử chưa kịp đo đạc layout
            try {
              flatListRef.current?.scrollToOffset({
                offset: info.highestMeasuredFrameIndex * 65,
                animated: true,
              });
            } catch {}
          }}
          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                onPress={() => handleLinePress(item.time)}
                activeOpacity={0.7}
                style={styles.lineTouch}
              >
                <Text
                  style={[
                    styles.lyricLineText,
                    isActive && styles.activeLineText,
                  ]}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  // Trường hợp 2: Chỉ có lời bài hát dạng văn bản tĩnh (Plain Lyrics)
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.plainLyricsText}>{currentLyrics.lyrics}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 120, // Tạo khoảng trống ở đầu và cuối để dòng hát luôn ở trung tâm khi cuộn
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  lineTouch: {
    minHeight: 65,
    justifyContent: "center",
    marginVertical: 4,
  },
  lyricLineText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    lineHeight: 28,
  },
  activeLineText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  plainLyricsText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 32,
  },
});
