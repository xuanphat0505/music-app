import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, router, useSegments, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { toastConfig } from "@/config/toastConfig";

// RootLayout khởi chạy và cung cấp cấu hình định tuyến Stack cơ bản cho toàn bộ ứng dụng
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <NavigationGuard /> */}
      <Slot />
      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
