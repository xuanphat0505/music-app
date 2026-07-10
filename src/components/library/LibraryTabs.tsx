import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/Colors";

interface LibraryTabsProps {
  activeTab: "playlists" | "songs";
  onTabChange: (tab: "playlists" | "songs") => void;
  triggerHaptic: () => void;
}

// Component hiển thị bộ chuyển đổi Tab giữa Playlists và Songs
export const LibraryTabs: React.FC<LibraryTabsProps> = ({
  activeTab,
  onTabChange,
  triggerHaptic,
}) => {
  return (
    <View style={styles.segmentContainer}>
      <TouchableOpacity
        style={[
          styles.segmentButton,
          activeTab === "playlists" && styles.segmentActiveButton,
        ]}
        onPress={() => {
          triggerHaptic();
          onTabChange("playlists");
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentText,
            activeTab === "playlists" && styles.segmentActiveText,
          ]}
        >
          Playlists
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.segmentButton,
          activeTab === "songs" && styles.segmentActiveButton,
        ]}
        onPress={() => {
          triggerHaptic();
          onTabChange("songs");
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.segmentText,
            activeTab === "songs" && styles.segmentActiveText,
          ]}
        >
          Songs
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  segmentActiveButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Outfit",
  },
  segmentActiveText: {
    color: "#ffffff",
  },
});
