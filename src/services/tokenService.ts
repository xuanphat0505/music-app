import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Bộ nhớ đệm lưu trữ Token dạng JS thuần trong RAM của ứng dụng để truy xuất nhanh
let accessToken: string | null = null;
let refreshToken: string | null = null;
let onAuthFailureCallback: (() => void) | null = null;

// Khôi phục token từ SecureStore vào RAM khi ứng dụng khởi động
export const loadTokensFromStorage = async () => {
  try {
    const access = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (access && refresh) {
      accessToken = access;
      refreshToken = refresh;
      return true;
    }
  } catch {
    // bỏ qua lỗi đọc bộ nhớ nếu xảy ra lỗi phần cứng
  }
  return false;
};

// Lấy Access Token hiện tại từ RAM (tốc độ tối đa)
export const getAccessToken = () => accessToken;

// Lấy Refresh Token hiện tại từ RAM
export const getRefreshToken = () => refreshToken;

// Lưu trữ cặp Access Token và Refresh Token mới vào cả RAM và SecureStore
export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;

  // lưu bất đồng bộ xuống bộ nhớ thiết bị mà không chặn luồng chính
  SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access).catch(() => {});
  SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh).catch(() => {});
};

// Xóa sạch Token khỏi cả RAM và SecureStore
export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;

  SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch(() => {});
  SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {});
};

// Đăng ký hàm callback xử lý khi phiên đăng nhập hết hạn hoặc lỗi xác thực xảy ra
export const registerAuthFailureCallback = (callback: () => void) => {
  onAuthFailureCallback = callback;
};

// Kích hoạt sự kiện lỗi xác thực để xóa token và cập nhật giao diện người dùng
export const triggerAuthFailure = () => {
  clearTokens();
  if (onAuthFailureCallback) {
    onAuthFailureCallback();
  }
};
