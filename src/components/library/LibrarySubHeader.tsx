import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Track } from "@/types";
import { SongActions } from "@/components/common";

interface LibrarySubHeaderProps {
  activeTab: "playlists" | "songs";
  playlistsCount: number;
  songsCount: number;
  tracks: Track[];
  triggerHaptic: () => void;
  onOpenSortModal: () => void;
}

// Component hiển thị phần thông tin chi tiết đầu danh mục (Sub-header) của Thư viện
export const LibrarySubHeader: React.FC<LibrarySubHeaderProps> = ({
  activeTab,
  playlistsCount,
  songsCount,
  tracks,
  triggerHaptic,
  onOpenSortModal,
}) => {
  return (
    <View style={styles.subHeaderContainer}>
      <View style={styles.subHeaderLeft}>
        <Text style={styles.subHeaderTag}>Trending Now</Text>
        <Text style={styles.subHeaderTitle}>
          {activeTab === "playlists" ? "Playlists" : "Songs"}
        </Text>
        <Text style={styles.subHeaderSubtitle}>
          {activeTab === "playlists"
            ? `Caziq Music • ${playlistsCount} playlists`
            : `Caziq Music • ${songsCount} songs`}
        </Text>
      </View>
      {activeTab === "songs" && (
        <SongActions
          tracks={tracks}
          triggerHaptic={triggerHaptic}
          onOpenSortModal={onOpenSortModal}
          showSortButton
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subHeaderContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  subHeaderLeft: {
    flex: 1,
  },
  subHeaderTag: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    letterSpacing: 1.2,
    fontFamily: "Inter",
    marginBottom: 2,
  },
  subHeaderTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  subHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
});
