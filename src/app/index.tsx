import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { isAuthenticated, isInitialized, initialize } = useAuth();

  // Gọi hàm nạp token và khôi phục phiên đăng nhập khi khởi động app
  useEffect(() => {
    initialize().catch(() => {});
  }, [initialize]);

  // Trong lúc đang đọc token từ máy lên, hiển thị màn hình chờ tải
  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#09090b",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // Sau khi hoàn thành kiểm tra, chuyển hướng người dùng tương ứng
  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
