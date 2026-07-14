import { create } from "zustand";
import { authApi } from "@/apis/authApi";
import { registerAuthFailureCallback, loadTokensFromStorage, clearTokens } from "@/services/tokenService";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  settings?: any;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, username: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

// Zustand store quản lý trạng thái xác thực của người dùng
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  user: null,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response: any = await authApi.login(email, password);
      const { user } = response.data;
      set({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          settings: user.settings,
        },
      });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email, username, password) => {
    set({ isLoading: true });
    try {
      await authApi.register(email, username, password);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // bỏ qua lỗi nếu gọi logout api lên server không thành công
    } finally {
      set({
        isAuthenticated: false,
        user: null,
      });
    }
  },

  initialize: async () => {
    try {
      const hasTokens = await loadTokensFromStorage();
      if (hasTokens) {
        // gọi api profile để khôi phục phiên nếu token hợp lệ
        const response: any = await authApi.getProfile();
        const user = response.data;
        set({
          user: {
            id: user.id || user._id,
            username: user.username || user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            settings: user.settings,
          },
          isAuthenticated: true,
        });
      }
    } catch {
      // xóa sạch token nếu token lưu trữ bị sai hoặc hết hạn không làm mới được
      clearTokens();
    } finally {
      set({ isInitialized: true });
    }
  },

  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));

// Đăng ký callback khi xảy ra sự cố lỗi xác thực
registerAuthFailureCallback(() => {
  useAuthStore.setState({
    isAuthenticated: false,
    user: null,
  });
});
