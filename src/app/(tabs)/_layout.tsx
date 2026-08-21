import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets, initialWindowMetrics } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { MiniPlayer } from "@/components/home";
import { HapticTab } from "@/components/haptic-tab";
import { FullPlayerModal } from "@/components/player";
import { AudioService } from "@/services/audioService";

// Bộ bố cục TabLayout cấu hình định dạng thanh điều hướng Bottom Tab Bar
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Khởi tạo thực thể AudioService để đăng ký theo dõi Zustand store
    AudioService.getInstance();

    return () => {
      // Giải phóng tài nguyên âm thanh khi layout bị hủy
      AudioService.getInstance().stop().catch(() => {});
    };
  }, []);

  // Tính toán chiều cao và khoảng đệm dưới cho TabBar dựa trên Safe Area Insets của thiết bị (kết hợp initialWindowMetrics ngay khi khởi chạy)
  const rawBottom = insets.bottom || initialWindowMetrics?.insets.bottom || 0;
  const bottomPadding = rawBottom > 0 ? rawBottom : (Platform.OS === "android" ? 16 : 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.PRIMARY,
          tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: tabBarHeight,
              paddingBottom: bottomPadding,
            },
          ],
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIconStyle,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              // <View style={styles.iconWrapper}>
              <Feather name="search" size={22} color={color} />
              // </View>
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color }) => (
              <Feather name="music" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
      <MiniPlayer />
      <FullPlayerModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  tabBar: {
    height: 60,
    borderTopWidth: 0,
    backgroundColor: COLORS.SURFACE,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingBottom: 4,
    paddingTop: 4,
  },
  tabBarItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarIconStyle: {
    marginBottom: 2,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "Inter",
  },
});
