import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Track } from "@/types";

interface LibrarySubHeaderProps {
  activeTab: "playlists" | "songs";
  playlistsCount: number;
  songsCount: number;
  tracks: Track[];
  playTrack: (track: Track) => void;
  triggerHaptic: () => void;
}

// Component hiển thị phần thông tin chi tiết đầu danh mục (Sub-header) của Thư viện
export const LibrarySubHeader: React.FC<LibrarySubHeaderProps> = ({
  activeTab,
  playlistsCount,
  songsCount,
  tracks,
  playTrack,
  triggerHaptic,
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
      <View style={styles.subHeaderRight}>
        {activeTab === "songs" && (
          <>
            <TouchableOpacity
              style={styles.circleActionButton}
              onPress={() => {
                triggerHaptic();
                Alert.alert(
                  "Sort & Filter",
                  "Chức năng sắp xếp và bộ lọc đang được phát triển.",
                );
              }}
              activeOpacity={0.7}
            >
              <Feather name="sliders" size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleActionButton}
              onPress={() => {
                triggerHaptic();
                if (tracks.length > 0) {
                  const randomIdx = Math.floor(Math.random() * tracks.length);
                  playTrack(tracks[randomIdx]);
                }
              }}
              activeOpacity={0.7}
            >
              <Feather name="shuffle" size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playActionButton}
              onPress={() => {
                triggerHaptic();
                if (tracks.length > 0) {
                  playTrack(tracks[0]);
                }
              }}
              activeOpacity={0.8}
            >
              <Feather
                name="play"
                size={20}
                color="#000000"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
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
    color: COLORS.TEXT_SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
    fontFamily: "Inter",
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
  subHeaderRight: {
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
  playActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
