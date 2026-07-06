import { create } from "zustand";

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, username: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

// Store quản lý trạng thái xác thực người dùng bao gồm đăng nhập, đăng xuất và thông tin tài khoản
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: async (email, password) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: "Alex",
        email: email,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      },
    });
    return true;
  },
  register: async (email, username, password) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: username,
        email: email,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      },
    });
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
