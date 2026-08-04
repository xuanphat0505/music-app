import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";

import { COLORS } from "@/constants/Colors";
import {
  ProfileHeader,
  MusicDNASection,
  SettingsGroup,
  EditProfileView,
} from "@/components/profile";
import { SettingItem, Artist } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { usePlaylistStore } from "@/store/playlistStore";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlayerStore } from "@/store/playerStore";
import { CustomModal } from "@/components/common";

// Màn hình thông tin cá nhân hiển thị chi tiết hồ sơ người dùng và các thiết lập nâng cao
export default function ProfileScreen() {
  const { user, logout, initialize } = useAuth();
  const [cacheSize, setCacheSize] = useState("0 KB");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [cacheModalVisible, setCacheModalVisible] = useState(false);

  const playlists = usePlaylistStore((state) => state.playlists);
  const fetchPlaylists = usePlaylistStore((state) => state.fetchPlaylists);
  const librarySongs = useLibraryStore((state) => state.librarySongs);
  const librarySongIds = useLibraryStore((state) => state.librarySongIds);
  const fetchLibraryData = useLibraryStore((state) => state.fetchLibraryData);
  const topArtists = useLibraryStore((state) => state.topArtists);
  const fetchTopArtists = useLibraryStore((state) => state.fetchTopArtists);
  const recentlyPlayed = usePlayerStore((state) => state.recentlyPlayed);

  const playerVolume = usePlayerStore((state) => state.volume);
  const setPlayerVolume = usePlayerStore((state) => state.setVolume);

  // Đo dung lượng cache thực tế trên thiết bị
  const updateCacheSize = async () => {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return;
    try {
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      let size = 0;
      for (const fileName of files) {
        const fileInfo = await FileSystem.getInfoAsync(cacheDir + fileName);
        if (fileInfo.exists && !fileInfo.isDirectory) {
          size += fileInfo.size;
        }
      }
      if (size >= 1024 * 1024) {
        setCacheSize(`${(size / (1024 * 1024)).toFixed(1)} MB`);
      } else if (size >= 1024) {
        setCacheSize(`${(size / 1024).toFixed(0)} KB`);
      } else {
        setCacheSize("0 KB");
      }
    } catch {
      setCacheSize("0 KB");
    }
  };

  // Tải cấu hình cài đặt từ bộ nhớ thiết bị
  const loadSavedSettings = async () => {
    try {
      const vol = await SecureStore.getItemAsync("player_volume");
      if (vol) {
        setPlayerVolume(parseFloat(vol));
      }
    } catch {}
  };

  // Tải danh sách phát, dữ liệu thư viện nhạc và cài đặt người dùng
  useEffect(() => {
    fetchPlaylists();
    fetchLibraryData().catch(() => {});
    fetchTopArtists().catch(() => {});
    loadSavedSettings().catch(() => {});
    updateCacheSize().catch(() => {});
  }, []);

  // Hook quản lý tính năng kéo để làm mới (Pull to Refresh) dùng chung
  const { refreshControl } = usePullToRefresh(async () => {
    await initialize();
    await fetchPlaylists();
    await fetchLibraryData().catch(() => {});
    await fetchTopArtists().catch(() => {});
    await loadSavedSettings().catch(() => {});
    await updateCacheSize().catch(() => {});
  });

  // Tính tổng số phút nghe nhạc có trong thư viện bài hát cá nhân
  const totalLibMins = useMemo(() => {
    const totalLibSeconds = librarySongs.reduce(
      (acc, song) => acc + (song.duration || 0),
      0,
    );
    return Math.round(totalLibSeconds / 60).toString();
  }, [librarySongs]);

  // Lấy danh sách nghệ sĩ hàng đầu (ưu tiên dữ liệu từ API -> lịch sử phát nhạc gần đây -> dữ liệu giả lập)
  const displayTopArtists = useMemo(() => {
    if (topArtists && topArtists.length > 0) {
      return topArtists.slice(0, 4);
    }
    const list: Artist[] = [];
    recentlyPlayed.forEach((track) => {
      track.artists.forEach((artist) => {
        if (
          typeof artist !== "string" &&
          !list.some((a) => a._id === artist._id)
        ) {
          list.push(artist);
        }
      });
    });
    return list.slice(0, 4);
  }, [topArtists, recentlyPlayed]);

  // Trích xuất thể loại nhạc hàng đầu từ thư viện và lịch sử nghe nhạc gần đây
  const topGenres = useMemo(() => {
    const genresList: string[] = [];
    [...recentlyPlayed, ...librarySongs].forEach((track) => {
      if (track.genre) {
        genresList.push(track.genre);
      }
    });

    if (genresList.length === 0) {
      return ["Electronic", "Lo-Fi", "Ambient", "Future Bass"];
    }

    const freqs = genresList.reduce<Record<string, number>>((acc, g) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(freqs)
      .sort((a, b) => freqs[b] - freqs[a])
      .slice(0, 4);
  }, [recentlyPlayed, librarySongs]);

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
        setEditModalVisible(true);
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



  const handleClearCache = async () => {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return;
    try {
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      for (const fileName of files) {
        await FileSystem.deleteAsync(cacheDir + fileName, { idempotent: true });
      }
      await updateCacheSize();
      Alert.alert("Thành công", "Đã dọn dẹp toàn bộ bộ nhớ đệm bài hát.");
    } catch {
      Alert.alert("Lỗi", "Không thể dọn dẹp bộ nhớ đệm.");
    }
  };

  const handleVolumeChange = (val: number) => {
    setPlayerVolume(val);
  };

  const handleSaveVolume = async () => {
    await SecureStore.setItemAsync("player_volume", playerVolume.toString()).catch(() => {});
  };

  // Các thiết lập thuộc nhóm Trải nghiệm Âm thanh
  const audioItems: SettingItem[] = [
    {
      id: "volume",
      icon: "volume-2",
      label: "Volume",
      value: `${Math.round(playerVolume * 100)}%`,
      isSlider: true,
      sliderValue: playerVolume,
      onSliderValueChange: handleVolumeChange,
      onSliderSlidingComplete: handleSaveVolume,
    },
    {
      id: "clear_cache",
      icon: "database",
      label: "Clear Cache",
      value: cacheSize,
      onPress: () => {
        triggerHaptic();
        setCacheModalVisible(true);
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
        setLogoutModalVisible(true);
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
        refreshControl={refreshControl}
      >
        {/* Phần đầu trang hồ sơ */}
        <ProfileHeader
          username={user?.username || ""}
          email={user?.email || ""}
          avatarUrl={
            user?.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
          }
          playlistsCount={playlists.length}
          followingCount={librarySongIds.length}
          minutesListened={totalLibMins}
          bio={user?.profile?.bio}
          location={user?.profile?.location}
          website={user?.profile?.website}
        />

        {/* Phần thống kê sở thích âm nhạc */}
        <MusicDNASection topGenres={topGenres} topArtists={displayTopArtists} />

        {/* Các nhóm thiết lập chi tiết */}
        <SettingsGroup title="Account" items={accountItems} />
        <SettingsGroup title="Playback & Audio" items={audioItems} />
        <SettingsGroup title="Preferences" items={appItems} />
        <SettingsGroup title="System" items={systemItems} />

        {/* Khoảng trống đệm cuối trang tránh bị MiniPlayer che khuất */}
        <View style={styles.bottomBuffer} />
      </ScrollView>

      {/* Giao diện chỉnh sửa thông tin cá nhân Slide-in */}
      <EditProfileView
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      />

      {/* Hộp thoại xác nhận đăng xuất tùy chỉnh */}
      <CustomModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất tài khoản?"
        icon="log-out"
        iconColor="#ef4444"
        cancelText="Hủy"
        confirmText="Đăng xuất"
        onConfirm={logout}
        isConfirmDestructive={true}
      />

      {/* Hộp thoại xác nhận xóa bộ nhớ đệm */}
      <CustomModal
        visible={cacheModalVisible}
        onClose={() => setCacheModalVisible(false)}
        title="Xóa bộ nhớ đệm"
        message={`Bạn có chắc chắn muốn xóa bộ nhớ đệm bài hát offline?\nDung lượng hiện tại: ${cacheSize}`}
        icon="database"
        iconColor="#ef4444"
        cancelText="Hủy"
        confirmText="Xóa đệm"
        onConfirm={handleClearCache}
        isConfirmDestructive={true}
      />
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
  modalOptionList: {
    width: "100%",
    marginVertical: 12,
  },
  modalOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  modalOptionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  modalOptionTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: "700",
  },
  volumeSliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  volumePercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 16,
    textAlign: "center",
  },
});
