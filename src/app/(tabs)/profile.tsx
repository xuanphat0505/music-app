import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "@/components/common";

// Màn hình Thông tin cá nhân hiển thị hồ sơ người dùng và các thiết lập cơ bản
export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Alex</Text>
        <Text style={styles.email}>alex@musichub.com</Text>
      </View>
      <View style={styles.settingsSection}>
        <GlassView style={styles.settingsItem}>
          <Text style={styles.settingsText}>Account Settings</Text>
        </GlassView>
        <GlassView style={styles.settingsItem}>
          <Text style={styles.settingsText}>Audio Quality</Text>
        </GlassView>
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
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  email: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    marginTop: 2,
  },
  settingsSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  settingsItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
  },
});
