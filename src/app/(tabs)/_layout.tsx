import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { MiniPlayer } from "@/components/home";
import { HapticTab } from "@/components/haptic-tab";

// Bộ bố cục TabLayout cấu hình định dạng thanh điều hướng Bottom Tab Bar
export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.PRIMARY,
          tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
          headerShown: false,
          tabBarStyle: styles.tabBar,
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
