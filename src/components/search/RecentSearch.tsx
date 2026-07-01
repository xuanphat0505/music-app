import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";
import React from "react";

interface RecentSearchProps {
  recentSearches: string[];
  handleClearAll: () => void;
  handleSelectRecent: (term: string) => void;
}

export const RecentSearch: React.FC<RecentSearchProps> = ({
  recentSearches,
  handleClearAll,
  handleSelectRecent,
}: RecentSearchProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleClearAll}>
          <Text style={styles.clearAllButton}>CLEAR ALL</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentList}>
        {recentSearches.map((term, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentPill}
            activeOpacity={0.8}
            onPress={() => handleSelectRecent(term)}
          >
            <Text style={styles.recentPillText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  sectionTitleBrowse: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 16,
  },
  clearAllButton: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    fontFamily: "Inter",
    letterSpacing: 0.5,
  },
  recentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  recentPill: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  recentPillText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
  },
});
