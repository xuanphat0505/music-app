import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";

type TabType = "all" | "songs" | "artists" | "albums";

interface FilterChipsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  hasSongs: boolean;
  hasArtists: boolean;
  hasAlbums: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeTab,
  onTabPress,
  hasSongs,
  hasArtists,
  hasAlbums,
}) => {
  const tabs: { type: TabType; label: string }[] = [
    { type: "all", label: "All" },
    { type: "songs", label: "Songs" },
    { type: "artists", label: "Artists" },
    { type: "albums", label: "Albums" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsContainer}
    >
      {tabs.map((tab) => {
        if (tab.type === "songs" && !hasSongs) return null;
        if (tab.type === "artists" && !hasArtists) return null;
        if (tab.type === "albums" && !hasAlbums) return null;

        const isActive = activeTab === tab.type;
        return (
          <TouchableOpacity
            key={tab.type}
            style={[styles.chipButton, isActive && styles.activeChipButton]}
            onPress={() => onTabPress(tab.type)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.activeChipText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeChipButton: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  chipText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  activeChipText: {
    color: "#FFFFFF",
  },
});
