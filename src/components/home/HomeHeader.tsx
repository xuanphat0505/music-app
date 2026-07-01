import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "../common";

// Tiêu đề đầu trang Home hiển thị tên thương hiệu, ảnh đại diện người dùng và nút nhận thông báo
export const HomeHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
          }}
          style={styles.avatar}
        />
        <Text style={styles.title}>MusicHub</Text>
      </View>
      <TouchableOpacity activeOpacity={0.8}>
        <GlassView style={styles.notificationButton}>
          <Feather name="bell" size={20} color={COLORS.TEXT_PRIMARY} />
        </GlassView>
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.GLASS_FILL,
  },
});
export default HomeHeader;
