import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface HeaderProps {
  title?: string;
  onSearchPress?: () => void;
}

// Component Header hiển thị tiêu đề đầu trang và nút tìm kiếm nhanh
export const Header: React.FC<HeaderProps> = ({ title = "Featured", onSearchPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onSearchPress}>
        <Feather name="search" size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
});

