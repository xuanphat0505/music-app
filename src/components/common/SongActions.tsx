import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Track } from "@/types";
import { usePlayerStore } from "@/store/playerStore";

interface SongActionsProps {
  tracks: Track[];
  triggerHaptic: () => void;
  onOpenSortModal?: () => void;
  showSortButton?: boolean;
}

// Component hiển thị nhóm các nút hành động phát nhạc
export const SongActions: React.FC<SongActionsProps> = ({
  tracks,
  triggerHaptic,
  onOpenSortModal,
  showSortButton = false,
}) => {
  const playAll = usePlayerStore((state) => state.playAll);
  const shufflePlay = usePlayerStore((state) => state.shufflePlay);
  const isShuffle = usePlayerStore((state) => state.isShuffle);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  // Nút Play chỉ được highlight khi đang phát nhạc và không ở chế độ Shuffle
  const isPlayActive = isPlaying && !isShuffle;

  return (
    <View style={styles.container}>
      {/* Nút Bộ lọc & Sắp xếp */}
      {showSortButton && onOpenSortModal && (
        <TouchableOpacity
          style={styles.circleActionButton}
          onPress={() => {
            triggerHaptic();
            onOpenSortModal();
          }}
          activeOpacity={0.7}
        >
          <Feather name="sliders" size={18} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Nút Phát ngẫu nhiên */}
      <TouchableOpacity
        style={isShuffle ? styles.highlightActionButton : styles.circleActionButton}
        onPress={() => {
          triggerHaptic();
          if (tracks.length > 0) {
            shufflePlay(tracks);
          }
        }}
        activeOpacity={0.8}
      >
        <Feather
          name="shuffle"
          size={18}
          color={isShuffle ? "#000000" : "#ffffff"}
        />
      </TouchableOpacity>

      {/* Nút Phát tất cả */}
      <TouchableOpacity
        style={isPlayActive ? styles.highlightActionButton : styles.circleActionButton}
        onPress={() => {
          triggerHaptic();
          if (tracks.length > 0) {
            playAll(tracks, 0);
          }
        }}
        activeOpacity={0.8}
      >
        <Feather
          name="play"
          size={18}
          color={isPlayActive ? "#000000" : "#ffffff"}
          style={{ marginLeft: isPlayActive ? 2 : 1 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circleActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});
