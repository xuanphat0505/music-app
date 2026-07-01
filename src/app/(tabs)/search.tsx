import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "@/components/common";

// Màn hình Tìm kiếm hỗ trợ người dùng lọc tìm các bài hát, ca sĩ và album yêu thích
export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      <GlassView style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color={COLORS.TEXT_SECONDARY}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Artists, songs, or lyrics..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          style={styles.searchInput}
        />
      </GlassView>
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
          Search for your favorite audio tracks
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.GLASS_FILL,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
    fontSize: 14,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    fontSize: 14,
  },
});
