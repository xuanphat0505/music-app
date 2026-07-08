import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import { setTokens, clearTokens } from "@/services/tokenService";

export const authApi = {
  // đăng nhập
  login: async (email: string, password?: string) => {
    const response: any = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    if (response?.data) {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
    }
    return response;
  },

  // đăng ký tài khoản mới
  register: async (email: string, username: string, password?: string) => {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, {
      email,
      username,
      password,
    });
  },

  // đăng xuất
  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearTokens();
    }
  },

  // lấy info user
  getProfile: async () => {
    return apiClient.get(ENDPOINTS.AUTH.ME);
  },
};
