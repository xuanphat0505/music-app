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
import { parseLrc } from "@/utils/lrcParser";
import { AudioService } from "@/services/audioService";

// Khoảng bù trừ thời gian mili-giây giúp khớp lời với tiếng chính xác hơn
const LYRICS_OFFSET_MS = 350;

// Component hiển thị danh sách lời bài hát tương tác dạng bản ghi có mốc thời gian
export const LyricsView: React.FC = () => {
  const {
    currentTrack,
    currentLyrics,
    isLyricsLoading,
    progress,
    setProgress,
    fetchLyrics,
  } = usePlayerStore();

  const flatListRef = useRef<FlatList>(null);

  // Tự động gọi API lấy lyrics nếu chưa có sẵn trong store
  useEffect(() => {
    if (currentTrack && !currentLyrics && !isLyricsLoading) {
      fetchLyrics(currentTrack._id).catch(() => {});
    }
  }, [currentTrack, currentLyrics, isLyricsLoading, fetchLyrics]);

  // Phân tích cú pháp chuỗi LRC thô sang mảng đối tượng câu hát kèm mốc thời gian
  const parsedLines = useMemo(() => {
    return currentLyrics?.syncedLyrics ? parseLrc(currentLyrics.syncedLyrics) : [];
  }, [currentLyrics?.syncedLyrics]);

  // Xác định dòng lyrics hiện tại dựa theo tiến trình thời gian nhạc thực tế
  const activeIndex = useMemo(() => {
    if (parsedLines.length === 0) return -1;
    const ms = progress * 1000 + LYRICS_OFFSET_MS;
    return parsedLines.findIndex((line, index) => {
      const nextLine = parsedLines[index + 1];
      return ms >= line.time && (!nextLine || ms < nextLine.time);
    });
  }, [progress, parsedLines]);

  // Tự động cuộn mượt mà đến câu hát hiện tại mỗi khi activeIndex thay đổi
  useEffect(() => {
    if (activeIndex >= 0 && parsedLines.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.3, // Đặt dòng active ở khoảng 1/3 chiều cao màn hình để tối ưu trải nghiệm đọc
      });
    }
  }, [activeIndex, parsedLines.length]);

  // Xử lý tua nhạc tới vị trí thời gian của câu hát được chọn
  const handleLinePress = (timeMs: number) => {
    const seconds = timeMs / 1000;
    setProgress(seconds);
    AudioService.getInstance().seekTo(seconds).catch(() => {});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Định dạng thời gian dạng mili-giây sang định dạng mm:ss để hiển thị trên nhãn thời gian
  const formatTimeMs = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
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

  // Trạng thái không có dữ liệu lời bài hát nào
  if (!currentLyrics || (!currentLyrics.lyrics && !currentLyrics.syncedLyrics)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>🎵 Lời bài hát chưa được cập nhật</Text>
      </View>
    );
  }

  // Trường hợp có lời bài hát đồng bộ thời gian (Interactive Transcript)
  if (currentLyrics.syncedLyrics && parsedLines.length > 0) {
    return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={parsedLines}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScrollToIndexFailed={(info) => {
            // Sử dụng scrollToOffset dựa trên ước lượng khoảng cách để tránh đệ quy vô hạn gây tràn call stack
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
          }}
          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                onPress={() => handleLinePress(item.time)}
                activeOpacity={0.7}
                style={styles.lineTouch}
              >
                <View style={styles.lineContent}>
                  <Text style={[styles.timeTag, isActive && styles.activeTimeTag]}>
                    {formatTimeMs(item.time)}
                  </Text>
                  <Text
                    style={[
                      styles.lyricLineText,
                      isActive && styles.activeLineText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  // Trường hợp chỉ có lời bài hát dạng văn bản tĩnh thông thường
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
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  lineTouch: {
    minHeight: 50,
    justifyContent: "center",
    marginVertical: 6,
  },
  lineContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timeTag: {
    width: 55,
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 12,
    fontFamily: "monospace",
    paddingTop: 4,
  },
  activeTimeTag: {
    color: COLORS.PRIMARY,
    fontWeight: "700",
  },
  lyricLineText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    lineHeight: 28,
  },
  activeLineText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  plainLyricsText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 32,
  },
});
