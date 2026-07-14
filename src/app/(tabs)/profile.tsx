import React, { useState } from "react";
import { ScrollView, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/Colors";
import {
  ProfileHeader,
  MusicDNASection,
  SettingsGroup,
} from "@/components/profile";
import { SettingItem, Artist } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const MOCK_TOP_ARTISTS: Artist[] = [
  {
    _id: "a1",
    audiusId: "audius-a1",
    name: "LUN",
    username: "lun_music",
    avatar:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "a2",
    audiusId: "audius-a2",
    name: "Pulse Engine",
    username: "pulse_engine",
    avatar:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "a3",
    audiusId: "audius-a3",
    name: "Azure Dreams",
    username: "azure_dreams",
    avatar:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "a4",
    audiusId: "audius-a4",
    name: "Orion",
    username: "orion_drift",
    avatar:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=150&auto=format&fit=crop",
  },
];

// Màn hình thông tin cá nhân hiển thị chi tiết hồ sơ người dùng và các thiết lập nâng cao
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [audioQuality, setAudioQuality] = useState("Lossless");
  const [cacheSize, setCacheSize] = useState("240 MB");

  // Hàm kích hoạt rung phản hồi nhẹ khi tương tác nút
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Các thiết lập thuộc nhóm Tài khoản
  const accountItems: SettingItem[] = [
    {
      id: "edit_profile",
      icon: "user",
      label: "Edit Profile",
      onPress: () => {
        triggerHaptic();
        Alert.alert(
          "Profile",
          "Chức năng chỉnh sửa hồ sơ đang được phát triển.",
        );
      },
    },
    {
      id: "subscription",
      icon: "credit-card",
      label: "Subscription Plan",
      value: "Premium VIP",
      onPress: () => {
        triggerHaptic();
        Alert.alert(
          "Subscription",
          "Bạn đang sử dụng gói Premium VIP trọn đời.",
        );
      },
    },
  ];

  // Các thiết lập thuộc nhóm Trải nghiệm Âm thanh
  const audioItems: SettingItem[] = [
    {
      id: "audio_quality",
      icon: "sliders",
      label: "Audio Quality",
      value: audioQuality,
      onPress: () => {
        triggerHaptic();
        Alert.alert(
          "Audio Quality",
          "Chọn chất lượng âm thanh mong muốn:",
          [
            { text: "Normal", onPress: () => setAudioQuality("Normal") },
            { text: "High", onPress: () => setAudioQuality("High") },
            {
              text: "Lossless (Hi-Fi)",
              onPress: () => setAudioQuality("Lossless"),
            },
          ],
          { cancelable: true },
        );
      },
    },
    {
      id: "equalizer",
      icon: "music",
      label: "Equalizer",
      onPress: () => {
        triggerHaptic();
        Alert.alert("Equalizer", "Bộ chỉnh âm EQ đang được thiết kế cấu hình.");
      },
    },
    {
      id: "clear_cache",
      icon: "database",
      label: "Clear Cache",
      value: cacheSize,
      onPress: () => {
        triggerHaptic();
        Alert.alert(
          "Clear Cache",
          "Bạn có chắc chắn muốn xóa bộ nhớ đệm bài hát offline?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Xóa",
              style: "destructive",
              onPress: () => {
                setCacheSize("0 KB");
                Alert.alert("Thành công", "Đã dọn dẹp bộ nhớ cache.");
              },
            },
          ],
        );
      },
    },
  ];

  // Các thiết lập thuộc nhóm Hẹn giờ và Thông báo
  const appItems: SettingItem[] = [
    {
      id: "sleep_timer",
      icon: "clock",
      label: "Sleep Timer",
      value: "Disabled",
      onPress: () => {
        triggerHaptic();
        Alert.alert("Sleep Timer", "Hẹn giờ tắt nhạc tự động.");
      },
    },
    {
      id: "notifications",
      icon: "bell",
      label: "Notifications",
      value: "On",
      onPress: () => {
        triggerHaptic();
        Alert.alert(
          "Notifications",
          "Chuyển tiếp đến cài đặt thông báo hệ thống.",
        );
      },
    },
  ];

  // Các thiết lập hệ thống như Đăng xuất
  const systemItems: SettingItem[] = [
    {
      id: "logout",
      icon: "log-out",
      label: "Logout",
      isDestructive: true,
      onPress: () => {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        ).catch(() => {});
        Alert.alert("Logout", "Bạn có chắc chắn muốn đăng xuất tài khoản?", [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng xuất", style: "destructive", onPress: () => logout() },
        ]);
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Phần đầu trang hồ sơ */}
        <ProfileHeader
          username={user?.username || ""}
          email={user?.email || ""}
          avatarUrl={
            user?.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
          }
          playlistsCount={12}
          followingCount={84}
          minutesListened="1,240"
        />

        {/* Phần thống kê sở thích âm nhạc */}
        <MusicDNASection
          topGenres={["Electronic", "Lo-Fi", "Ambient", "Future Bass"]}
          topArtists={MOCK_TOP_ARTISTS}
        />

        {/* Các nhóm thiết lập chi tiết */}
        <SettingsGroup title="Account" items={accountItems} />
        <SettingsGroup title="Playback & Audio" items={audioItems} />
        <SettingsGroup title="Preferences" items={appItems} />
        <SettingsGroup title="System" items={systemItems} />

        {/* Khoảng trống đệm cuối trang tránh bị MiniPlayer che khuất */}
        <View style={styles.bottomBuffer} />
      </ScrollView>
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
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bottomBuffer: {
    height: 100,
  },
});
