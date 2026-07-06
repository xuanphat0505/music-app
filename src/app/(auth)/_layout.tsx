import { Stack } from "expo-router";

// Layout bao bọc nhóm định tuyến xác thực, tắt header mặc định cho màn hình đăng nhập
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
