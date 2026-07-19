import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { LyricsView } from "./LyricsView";
import { formatArtistNames } from "@/utils/artist";

interface LyricsModalProps {
  visible: boolean;
  onClose: () => void;
}

// Component Modal hiển thị lời bài hát riêng biệt với nền màu tối trơn
export const LyricsModal: React.FC<LyricsModalProps> = ({ visible, onClose }) => {
  const { currentTrack } = usePlayerStore();

  if (!currentTrack) return null;

  // Hàm xử lý đóng modal và kích hoạt phản hồi xúc giác nhẹ
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Thanh tiêu đề phía trên chứa tên bài hát và nút đóng */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Feather
                name="chevron-down"
                size={28}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {formatArtistNames(currentTrack.artists)}
              </Text>
            </View>

            <View style={styles.placeholderButton} />
          </View>

          {/* Vùng hiển thị danh sách lời bài hát chạy chữ */}
          <View style={styles.content}>
            <LyricsView />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE,
  },
  closeButton: {
    padding: 8,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  songTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  songArtist: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    marginTop: 2,
    textAlign: "center",
  },
  placeholderButton: {
    width: 44,
  },
  content: {
    flex: 1,
  },
});
